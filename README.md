# Scholarly

A React app for youth opportunities: explore volunteering, scholarships, and academic pathways (GED, OSSD, IGCSE, A-Levels, Myanmar Matriculation).

## Quick start

```bash
npm install
npm run dev
```

**Auth (MVP):** Login and profile use `localStorage` only (no backend). Sign up, set your profile (age, education level) on the Profile page, then visit Scholarships to see "Recommended for you."

**Admin:** Users listed in the admin list (see `src/api/auth.js`) get the Admin nav link and can access `/admin`; others are redirected.
