# scholarly

Python utilities to collect public Facebook Page posts about youth volunteering
opportunities and prepare them for display on a website. This uses the official
Facebook Graph API and requires Page Public Content Access.

## Quick start

1) Create a Meta app and obtain a valid access token with Page Public Content
   Access for the pages you want to read.
2) Create a virtual environment and install dependencies.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
```

3) Set your token and run the fetcher.

```bash
export FB_ACCESS_TOKEN="YOUR_TOKEN"
python scripts/fetch_facebook_posts.py \
  --sources data/sources.json \
  --keywords data/keywords.txt \
  --output public/opportunities.json \
  --since-days 30
```

4) Start the React dev server.

```bash
npm install
npm run dev
```

**Auth (MVP):** Login and profile use `localStorage` only (no backend). Sign up, set your profile (age, education level) on the Profile page, then visit Scholarships to see "Recommended for you." **Admin:** Only the user with email `admin@scholarly.local` gets the Admin nav link and can access `/admin`; others are redirected.

## Configuration

- `data/sources.json`: list of Facebook Pages to query.
  - Provide `page_id` OR a resolvable `page_username` or `page_url`.
- `data/keywords.txt`: one keyword per line. Empty file means "no filter."

## Notes

- This script only fetches public posts and does not bypass access controls.
- The output file is JSON and can be used by your website or a small API.
