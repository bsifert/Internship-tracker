# Internship Tracker

**Live site:** https://bsifert.github.io/Internship-tracker/

A single-page web app for tracking your internship search: which companies are
open (`LIVE`), opening soon (`IMMINENT`), on the radar (`WATCH`), or not yet
researched, plus priority/urgency, whether you've applied, cover letter
status, contacts, deadlines, and notes.

Seeded with the companies from the original *Internship Tracker 2027* Google
Sheet on first load.

## Features

- **Urgency board** — companies grouped by research status (Live / Imminent /
  Watch / Unresearched) and sorted by priority, so it's obvious what to work
  on next.
- **Table view** — every field in a sortable, filterable grid.
- **Dashboard** — quick counts: total tracked, applied, live postings,
  imminent postings, high-priority companies you haven't applied to yet,
  and cover letters drafted.
- **Search & filters** — by text, priority, research status, applied/not
  applied, and sector.
- **Add / edit / delete** any entry through a form modal — company, sector,
  size, office, research status, priority, citizenship/clearance requirement,
  applied flag, application status, deadline, contact, cover letter status,
  and free-text notes.
- **Autosave** — everything is saved to `localStorage` in your browser as you
  go, no account or server required.
- **Backup / restore** — export to a JSON file (full-fidelity backup/restore,
  or to move data to another browser) or CSV (for opening in a spreadsheet).
  A "Reset to original sheet data" option restores the original seed list.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. Data lives only in that browser's
`localStorage` — export a JSON backup periodically if you want a copy outside
the browser, or use it to carry your progress to another machine.

## Building for production

```bash
npm run build
```

Outputs a static site to `dist/` — deployable to GitHub Pages, Netlify,
Vercel, or any static host.
