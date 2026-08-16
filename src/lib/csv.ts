import type { Internship } from "../types";

/**
 * A row parsed from CSV. Only columns actually present in the file appear,
 * so merging one of these over an existing record can't blank out fields the
 * spreadsheet never mentioned.
 */
export type CsvRow = Partial<Internship> & { company: string };

const COLUMNS: Array<keyof Internship> = [
  "company",
  "sector",
  "size",
  "nearestOffice",
  "url",
  "researchStatus",
  "priority",
  "citizenship",
  "applied",
  "status",
  "deadline",
  "followUpDate",
  "contact",
  "coverLetter",
  "myNotes",
  "researchNotes",
  "lastResearched",
];

function escapeCell(value: unknown): string {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv(items: Internship[]): string {
  const header = COLUMNS.join(",");
  const rows = items.map((item) =>
    COLUMNS.map((col) => escapeCell(item[col])).join(","),
  );
  return [header, ...rows].join("\n");
}

/** Split CSV text into rows of cells, honouring quoted fields and CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  // Strip a UTF-8 BOM, which Excel loves to prepend.
  const input = text.replace(/^﻿/, "");

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      // Treat CRLF as a single break.
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

/** Loose header matching, so exports from Google Sheets import cleanly. */
const HEADER_ALIASES: Record<string, keyof Internship> = {
  company: "company",
  sector: "sector",
  size: "size",
  nearestoffice: "nearestOffice",
  office: "nearestOffice",
  url: "url",
  link: "url",
  posting: "url",
  postingurl: "url",
  researchstatus: "researchStatus",
  research: "researchStatus",
  priority: "priority",
  uscitizenshipclearance: "citizenship",
  citizenship: "citizenship",
  clearance: "citizenship",
  applied: "applied",
  status: "status",
  applicationstatus: "status",
  deadline: "deadline",
  followupdate: "followUpDate",
  followup: "followUpDate",
  contact: "contact",
  coverletter: "coverLetter",
  mynotes: "myNotes",
  notes: "myNotes",
  researchnotes: "researchNotes",
  lastresearched: "lastResearched",
};

function headerKey(raw: string): keyof Internship | null {
  const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
  return HEADER_ALIASES[cleaned] ?? null;
}

const TRUTHY = new Set(["yes", "y", "true", "1", "applied", "x", "✓"]);

/**
 * Turn CSV text into partial internship records.
 *
 * Unknown columns are ignored, and blank cells are omitted entirely rather
 * than emitted as empty strings — otherwise merging a sheet that lacks, say,
 * a "Cover Letter" column would silently wipe that field on every row it
 * touches.
 */
export function csvToRows(text: string): CsvRow[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const [headerRow, ...dataRows] = rows;
  const keys = headerRow.map(headerKey);
  if (!keys.includes("company")) {
    throw new Error(
      'No "Company" column found. The first row must be a header row.',
    );
  }

  return dataRows
    .map((cells) => {
      const record: Record<string, unknown> = {};
      keys.forEach((key, index) => {
        if (!key) return;
        const raw = (cells[index] ?? "").trim();
        if (key === "applied") {
          // A boolean is always meaningful, including an explicit "no".
          if (raw !== "") record[key] = TRUTHY.has(raw.toLowerCase());
          return;
        }
        if (raw !== "") record[key] = raw;
      });
      return record as CsvRow;
    })
    .filter((record) => String(record.company ?? "").trim().length > 0);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

export function downloadCsv(items: Internship[]) {
  download(
    new Blob([toCsv(items)], { type: "text/csv;charset=utf-8;" }),
    `internship-tracker-${stamp()}.csv`,
  );
}

export function downloadJson(items: Internship[]) {
  download(
    new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }),
    `internship-tracker-backup-${stamp()}.json`,
  );
}
