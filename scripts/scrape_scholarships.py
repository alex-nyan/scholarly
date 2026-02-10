#!/usr/bin/env python3
"""
Scrape scholarship listings from configured websites.
- Groups same provider (e.g. DAAD) and deduplicates by normalized title within group.
- Extracts education_level, eligibility, age_limits, amount, deadline where possible.
Output: public/scholarships.json
"""
import json
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SOURCES = PROJECT_ROOT / "data" / "scholarship_sources.json"
DEFAULT_OUTPUT = PROJECT_ROOT / "public" / "scholarships.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
}
TIMEOUT = 15

# Keywords that suggest a link is about scholarships/funding
SCHOLARSHIP_KEYWORDS = re.compile(
    r"scholarship|stipend|funding|grant|fellowship|bursary|financial.?aid",
    re.I,
)

# Education level patterns (for parsing from text)
EDUCATION_PATTERNS = re.compile(
    r"\b(high\s*school|undergraduate|bachelor['\u2019]?s?|master['\s]*s?|m\.?s\.?|m\.?a\.?|"
    r"phd|doctoral|graduate|mba|any\s*education|associate)\b",
    re.I,
)
DEADLINE_PATTERN = re.compile(
    r"(?:deadline|next\s*deadline)[:\s]*([^\n|]+?)(?:\s*\||\s*$|\s*Study)",
    re.I,
)
AGE_LIMIT_PATTERN = re.compile(
    r"(?:age|under|maximum|max\.?)\s*[:\s]*(\d{1,3})\s*(?:years?|y\.?o\.?)?",
    re.I,
)


def load_sources(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("sources must be a JSON list")
    return data


def normalize_url(url, base):
    if not url or url.startswith(("#", "mailto:", "javascript:")):
        return None
    full = urljoin(base, url)
    parsed = urlparse(full)
    path = parsed.path.rstrip("/") or "/"
    return f"{parsed.scheme}://{parsed.netloc}{path}"


def normalize_title_for_grouping(title):
    if not title or not isinstance(title, str):
        return ""
    t = unicodedata.normalize("NFKC", title.lower().strip())
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"[^\w\s]", "", t)
    return t.strip()[:120]


def is_scholarship_link(href, text):
    combined = f"{href or ''} {text or ''}"
    return bool(SCHOLARSHIP_KEYWORDS.search(combined))


def extract_education_level(text):
    """Extract first education level mention from text."""
    if not text:
        return None
    m = EDUCATION_PATTERNS.search(text)
    if m:
        return m.group(1).strip()
    return None


def extract_deadline(text):
    if not text:
        return None
    m = DEADLINE_PATTERN.search(text)
    if m:
        return m.group(1).strip()
    return None


def extract_age_limits(text):
    if not text:
        return None
    m = AGE_LIMIT_PATTERN.search(text)
    if m:
        return m.group(1).strip()
    return None


# --------------- Scholars4Dev ---------------
def scrape_scholars4dev(url, source_name):
    """Parse scholars4dev.com homepage/list: h2 links + degree/deadline/study in from following text."""
    resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    base = resp.url
    base_domain = urlparse(base).netloc
    items = []

    # Find main content: often div with class containing 'content' or 'entry'
    main = soup.find("div", class_=re.compile(r"content|entry|post", re.I))
    if not main:
        main = soup

    for h2 in main.find_all("h2"):
        a = h2.find("a", href=True)
        if not a:
            continue
        href = a.get("href", "").strip()
        full_url = normalize_url(href, base)
        if not full_url or "scholars4dev.com" not in urlparse(full_url).netloc:
            continue
        title = (a.get_text() or "").strip()[:300]
        if not title or len(title) < 5:
            continue

        # Skip list/aggregate pages like "Top 75 International Scholarships"
        if re.search(r"^top\s+\d+", title, re.I) or "list of" in title.lower():
            continue

        # Next siblings until next h2: look for provider (em/i), degree line, deadline, study in
        education_level = None
        deadline = None
        study_in = None
        block_text = []
        for sib in h2.find_next_siblings():
            if sib.name == "h2":
                break
            t = sib.get_text(separator=" ", strip=True) if hasattr(sib, "get_text") else ""
            if t:
                block_text.append(t)
                if not education_level:
                    education_level = extract_education_level(t)
                if not deadline and ("deadline" in t.lower() or "next" in t.lower()):
                    deadline = extract_deadline(t) or t[:80]
                if "study in:" in t.lower():
                    study_in = re.sub(r"(?i)study\s+in\s*:\s*", "", t).strip()[:100]

        eligibility = None
        if study_in:
            eligibility = f"Study in: {study_in}"

        items.append({
            "message": title,
            "source": source_name,
            "permalink_url": full_url,
            "education_level": education_level,
            "eligibility": eligibility,
            "age_limits": None,
            "amount": None,
            "deadline": deadline,
        })
    return items


# --------------- Bold.org ---------------
def scrape_bold_org(url, source_name):
    """Parse Bold.org scholarships page: cards with links and education/amount/deadline."""
    resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    base = resp.url
    items = []
    seen_urls = set()

    # Bold.org uses Next.js; links are like /scholarships/slug or full URL
    for a in soup.find_all("a", href=True):
        href = a.get("href", "").strip()
        full_url = normalize_url(href, base)
        if not full_url:
            continue
        parsed = urlparse(full_url)
        if "bold.org" not in parsed.netloc:
            continue
        if "/scholarships/" not in full_url or full_url.count("/") < 4:
            continue
        if full_url in seen_urls:
            continue
        seen_urls.add(full_url)

        # Title: link text or nearby heading
        title = (a.get_text() or "").strip()
        if not title or len(title) < 3:
            parent = a.parent
            for _ in range(5):
                if not parent:
                    break
                title = (parent.get_text() or "").strip()
                if len(title) > 10 and len(title) < 200:
                    break
                parent = parent.parent
            if not title or len(title) < 3:
                title = full_url.split("/")[-1].replace("-", " ").title()
        title = title[:300]

        # Walk up to find card container and get Education level, Amount, Deadline
        education_level = None
        amount = None
        deadline = None
        node = a
        for _ in range(15):
            node = node.parent
            if not node:
                break
            text = node.get_text(separator=" ", strip=True)
            if not education_level:
                education_level = extract_education_level(text)
            if "amount" in text.lower() and not amount:
                am = re.search(r"amount\s*\$?([\d,]+)", text, re.I)
                if am:
                    amount = f"${am.group(1)}"
            if "deadline" in text.lower() and not deadline:
                deadline = extract_deadline(text)
            if education_level and (amount or deadline):
                break

        items.append({
            "message": title,
            "source": source_name,
            "permalink_url": full_url,
            "education_level": education_level,
            "eligibility": None,
            "age_limits": None,
            "amount": amount,
            "deadline": deadline,
        })
    return items


# --------------- Appily ---------------
def scrape_appily(url, source_name):
    """Collect scholarship links from Appily; extract education from link text/context where possible."""
    resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    base = resp.url
    base_domain = urlparse(base).netloc
    seen = set()
    items = []

    for a in soup.find_all("a", href=True):
        href = a.get("href", "").strip()
        full_url = normalize_url(href, base)
        if not full_url:
            continue
        parsed = urlparse(full_url)
        if parsed.netloc != base_domain:
            continue
        if "scholarship" not in full_url.lower() and "scholarship" not in (a.get_text() or "").lower():
            continue
        if full_url in seen:
            continue
        seen.add(full_url)
        title = (a.get_text() or "").strip()[:300]
        if not title:
            title = full_url.split("/")[-1].replace("-", " ").title()
        education_level = extract_education_level(title)
        items.append({
            "message": title,
            "source": source_name,
            "permalink_url": full_url,
            "education_level": education_level,
            "eligibility": None,
            "age_limits": None,
            "amount": None,
            "deadline": None,
        })
    return items


# --------------- Generic (e.g. DAAD) ---------------
def scrape_generic(url, source_name):
    """Link-based scrape: same-domain or scholarship links with keyword filter."""
    resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    base = resp.url
    base_domain = urlparse(base).netloc
    seen = set()
    items = []

    for a in soup.find_all("a", href=True):
        href = a.get("href", "").strip()
        text = (a.get_text() or "").strip()
        if not is_scholarship_link(href, text):
            continue
        full_url = normalize_url(href, base)
        if not full_url or full_url in seen:
            continue
        parsed = urlparse(full_url)
        if parsed.netloc and parsed.netloc != base_domain:
            if not is_scholarship_link(full_url, text):
                continue
        seen.add(full_url)
        title = text[:300] if text else full_url
        # Filter out nav/language links
        if len(title) <= 3 or title.lower() in ("de", "en", "vi", "report an accessibility issue"):
            continue
        items.append({
            "message": title,
            "source": source_name,
            "permalink_url": full_url,
            "education_level": extract_education_level(title),
            "eligibility": None,
            "age_limits": None,
            "amount": None,
            "deadline": None,
        })
    return items


def scraper_for_url(url):
    """Return the scraper function and source name for a given URL."""
    domain = urlparse(url).netloc.lower()
    if "scholars4dev.com" in domain:
        return scrape_scholars4dev
    if "bold.org" in domain:
        return scrape_bold_org
    if "appily.com" in domain:
        return scrape_appily
    return scrape_generic


def dedupe_by_url(results):
    """Keep first occurrence of each permalink_url."""
    by_url = {}
    for r in results:
        u = r.get("permalink_url")
        if u and u not in by_url:
            by_url[u] = r
    return list(by_url.values())


def dedupe_by_group(results, sources_by_name):
    """
    When source has 'group' (e.g. DAAD), keep one entry per (normalized_title, group)
    so we don't list the same scholarship from multiple regional DAAD sites.
    Use first source name in group as display name.
    """
    # Build group -> source name (first one wins for display)
    group_to_display = {}
    for src in sources_by_name:
        g = src.get("group")
        if g and g not in group_to_display:
            group_to_display[g] = src.get("name", g)

    # Group items by (normalized_title, group); keep first URL and merge source label
    key_to_item = {}
    for r in results:
        name = r.get("source", "")
        group = None
        for src in sources_by_name:
            if src.get("name") == name and src.get("group"):
                group = src["group"]
                break
        title = r.get("message", "")
        norm = normalize_title_for_grouping(title)
        if not norm:
            key_to_item[id(r)] = r
            continue
        key = (norm, group) if group else (norm, id(r))
        if key not in key_to_item:
            item = {**r}
            if group:
                item["source"] = group_to_display.get(group, group)
            key_to_item[key] = item
    return list(key_to_item.values())


def main():
    sources_path = PROJECT_ROOT / "data" / "scholarship_sources.json"
    output_path = DEFAULT_OUTPUT
    if len(sys.argv) > 1:
        sources_path = Path(sys.argv[1])
    if len(sys.argv) > 2:
        output_path = Path(sys.argv[2])

    sources = load_sources(sources_path)
    all_results = []
    errors = []

    for src in sources:
        name = src.get("name", "Unknown")
        url = src.get("url")
        if not url:
            errors.append({"source": name, "error": "Missing url"})
            continue
        try:
            scrape_fn = scraper_for_url(url)
            items = scrape_fn(url, name)
            all_results.extend(items)
        except Exception as e:
            errors.append({"source": name, "error": str(e)})

    # 1) Dedupe by URL
    results = dedupe_by_url(all_results)

    # 2) Dedupe by group + normalized title (e.g. one "Research Grants in Germany" for DAAD)
    results = dedupe_by_group(results, sources)

    # Drop internal keys if we added any; ensure consistent shape
    for r in results:
        for k in list(r.keys()):
            if r[k] is None:
                del r[k]

    payload = {
        "generated_at": datetime.now(tz=timezone.utc).isoformat(),
        "sources_count": len(sources),
        "results_count": len(results),
        "results": results,
        "errors": errors,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Scraped {len(results)} scholarships from {len(sources)} sources -> {output_path}")
    if errors:
        print("Errors:", [e["source"] + ": " + e["error"] for e in errors])


if __name__ == "__main__":
    main()
