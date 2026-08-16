# Internship Tracker

**Live site:** https://bsifert.github.io/Internship-tracker/

A single-page web app for tracking your internship search: which companies are
open (`LIVE`), opening soon (`IMMINENT`), on the radar (`WATCH`), or not yet
researched, plus priority/urgency, whether you've applied, cover letter
status, contacts, deadlines, and notes.

Seeded with the companies from the original *Internship Tracker 2027* Google
Sheet on first load.

## Features

- **"Do these next"** — a ranked list of what actually needs action, scoring
  overdue deadlines, due follow-ups, live postings and imminent openings
  against each other so the most pressing thing is always on top.
- **Urgency board** — companies grouped by research status (Live / Imminent /
  Watch / Unresearched), ordered within each column by real time pressure
  rather than a static field. Applied rows sink to the bottom.
- **Table view** — every field in a sortable, filterable grid, with
  multi-select for bulk edits.
- **Dashboard** — total tracked, applied, overdue, due within 14 days,
  high-priority-not-applied, live, imminent, cover letters, warm contacts,
  and how many are interviewing or at offer.
- **Posting links** — store the job or careers URL per company and jump
  straight to it from a card, a table row, or the next-actions list.
- **Follow-ups & history** — set a date to chase each application, and see an
  automatic timeline of every status change.
- **Search & filters** — by text, priority, research status, applied state,
  and sector.
- **Bulk edit** — select rows in the table to change status, priority,
  research status or cover letter across many companies at once.
- **Autosave** — everything is saved to `localStorage` in your browser as you
  go, no account or server required.
- **Backup nudges** — because the data lives only in your browser, the app
  reminds you to take a JSON backup when the last one goes stale.
- **Import / export** — export JSON (full-fidelity backup) or CSV. Restore a
  JSON backup, or merge a CSV straight from Google Sheets: it matches on
  company name, updates what's there, adds what isn't, and leaves any column
  your file doesn't include untouched.
- **Clipped-note flags** — the original sheet was exported as a PDF, which cut
  long research notes mid-sentence. Affected rows are flagged so you can spot
  and rewrite them.

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
