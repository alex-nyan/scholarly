import argparse
import json
import os
import time
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import requests


DEFAULT_API_VERSION = "v19.0"
DEFAULT_LIMIT = 25
DEFAULT_MAX_PAGES = 3


def load_sources(path):
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("sources must be a JSON list")
    return data


def load_keywords(path):
    if not path:
        return []
    with open(path, "r", encoding="utf-8") as handle:
        return [line.strip().lower() for line in handle if line.strip()]


def parse_username_from_url(page_url):
    if not page_url:
        return None
    parsed = urlparse(page_url)
    if not parsed.netloc:
        return None
    parts = [p for p in parsed.path.split("/") if p]
    if not parts:
        return None
    return parts[0]


def graph_get(api_version, path, access_token, params=None):
    params = params or {}
    params["access_token"] = access_token
    url = f"https://graph.facebook.com/{api_version}/{path}"
    response = requests.get(url, params=params, timeout=30)
    if response.status_code != 200:
        raise RuntimeError(f"Graph API error {response.status_code}: {response.text}")
    return response.json()


def resolve_page_id(api_version, access_token, source):
    if source.get("page_id"):
        return source["page_id"]
    username = source.get("page_username") or parse_username_from_url(source.get("page_url"))
    if not username or "REPLACE_ME" in username:
        raise ValueError(
            f"Source '{source.get('name')}' is missing page_id/page_username/page_url."
        )
    data = graph_get(api_version, username, access_token, params={"fields": "id,name"})
    return data["id"]


def fetch_posts(api_version, access_token, page_id, since_epoch, limit, max_pages):
    fields = "message,created_time,permalink_url,attachments{media_type,url,title,description}"
    params = {"fields": fields, "limit": limit}
    if since_epoch:
        params["since"] = since_epoch

    posts = []
    next_url = None
    pages_fetched = 0

    while pages_fetched < max_pages:
        if pages_fetched == 0:
            data = graph_get(api_version, f"{page_id}/posts", access_token, params=params)
        else:
            response = requests.get(next_url, timeout=30)
            if response.status_code != 200:
                raise RuntimeError(
                    f"Graph API error {response.status_code}: {response.text}"
                )
            data = response.json()

        posts.extend(data.get("data", []))
        next_url = data.get("paging", {}).get("next")
        pages_fetched += 1
        if not next_url:
            break
        time.sleep(0.2)

    return posts


def matches_keywords(message, keywords):
    if not keywords:
        return True
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in keywords)


def normalize_post(source, post):
    return {
        "source": source.get("name"),
        "page_id": source.get("page_id"),
        "message": post.get("message"),
        "created_time": post.get("created_time"),
        "permalink_url": post.get("permalink_url"),
        "attachments": post.get("attachments", {}).get("data", []),
    }


def parse_args():
    parser = argparse.ArgumentParser(
        description="Fetch public Facebook Page posts using Graph API."
    )
    parser.add_argument("--sources", required=True, help="Path to sources.json")
    parser.add_argument("--keywords", default="", help="Path to keywords.txt")
    parser.add_argument("--output", required=True, help="Output JSON path")
    parser.add_argument("--api-version", default=DEFAULT_API_VERSION)
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--max-pages", type=int, default=DEFAULT_MAX_PAGES)
    parser.add_argument("--since-days", type=int, default=30)
    return parser.parse_args()


def main():
    args = parse_args()
    access_token = os.getenv("FB_ACCESS_TOKEN")
    if not access_token:
        raise RuntimeError("FB_ACCESS_TOKEN is not set.")

    sources = load_sources(args.sources)
    keywords = load_keywords(args.keywords)

    since_epoch = None
    if args.since_days and args.since_days > 0:
        since = datetime.now(timezone.utc) - timedelta(days=args.since_days)
        since_epoch = int(since.timestamp())

    results = []
    errors = []
    for source in sources:
        try:
            page_id = resolve_page_id(args.api_version, access_token, source)
            source["page_id"] = page_id
            posts = fetch_posts(
                args.api_version,
                access_token,
                page_id,
                since_epoch,
                args.limit,
                args.max_pages,
            )
            for post in posts:
                message = post.get("message", "")
                if not message:
                    continue
                if matches_keywords(message, keywords):
                    results.append(normalize_post(source, post))
        except Exception as exc:  # noqa: BLE001
            errors.append({"source": source.get("name"), "error": str(exc)})

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sources_count": len(sources),
        "results_count": len(results),
        "results": results,
        "errors": errors,
    }

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)

    print(f"Wrote {len(results)} opportunities to {args.output}")
    if errors:
        print("Errors:")
        for error in errors:
            print(f"- {error['source']}: {error['error']}")


if __name__ == "__main__":
    main()
