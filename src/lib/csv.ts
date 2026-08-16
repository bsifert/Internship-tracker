import type { Internship } from "../types";

const COLUMNS: Array<keyof Internship> = [
  "company",
  "sector",
  "size",
  "nearestOffice",
  "researchStatus",
  "priority",
  "citizenship",
  "applied",
  "status",
  "deadline",
  "contact",
  "coverLetter",
  "myNotes",
  "researchNotes",
  "lastResearched",
];

function escapeCell(value: unknown): string {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) {
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

export function downloadCsv(items: Internship[], filename = "internship-tracker.csv") {
  const csv = toCsv(items);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(items: Internship[], filename = "internship-tracker-backup.json") {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
