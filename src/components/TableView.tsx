import { useMemo, useState } from "react";
import type { Internship } from "../types";
import { isNoteTruncated } from "../types";
import {
  CoverLetterBadge,
  PriorityBadge,
  ResearchBadge,
  StatusBadge,
} from "./Badges";
import { cx, daysUntil, deadlineTone, formatDate } from "../lib/utils";

type SortKey =
  | "company"
  | "sector"
  | "priority"
  | "researchStatus"
  | "deadline"
  | "followUpDate"
  | "lastResearched";

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 } as const;
const RESEARCH_ORDER = { LIVE: 0, IMMINENT: 1, WATCH: 2, UNRESEARCHED: 3 } as const;

function byDate(a: string, b: string): number {
  // Blank dates sort last rather than pretending to be 1970.
  const da = a ? new Date(a).getTime() : Infinity;
  const db = b ? new Date(b).getTime() : Infinity;
  return da - db;
}

function compareValues(a: Internship, b: Internship, key: SortKey): number {
  switch (key) {
    case "priority":
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    case "researchStatus":
      return RESEARCH_ORDER[a.researchStatus] - RESEARCH_ORDER[b.researchStatus];
    case "deadline":
      return byDate(a.deadline, b.deadline);
    case "followUpDate":
      return byDate(a.followUpDate, b.followUpDate);
    case "lastResearched":
      return byDate(b.lastResearched, a.lastResearched);
    default:
      return String(a[key]).localeCompare(String(b[key]));
  }
}

const headerCell =
  "whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: "asc" | "desc";
  onClick: (key: SortKey) => void;
}) {
  return (
    <th
      scope="col"
      className={headerCell}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onClick(sortKey)}
        className="flex items-center gap-1 uppercase tracking-wide hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:hover:text-slate-100"
      >
        {label}
        <span aria-hidden="true">{active ? (dir === "asc" ? "↑" : "↓") : ""}</span>
      </button>
    </th>
  );
}

export function TableView({
  items,
  onEdit,
  onToggleApplied,
  onDelete,
  selected,
  onSelectedChange,
}: {
  items: Internship[];
  onEdit: (item: Internship) => void;
  onToggleApplied: (id: string) => void;
  onDelete: (id: string) => void;
  selected: Set<string>;
  onSelectedChange: (next: Set<string>) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const primary = compareValues(a, b, sortKey);
      const cmp = sortDir === "asc" ? primary : -primary;
      if (cmp !== 0) return cmp;
      return a.company.localeCompare(b.company);
    });
    return copy;
  }, [items, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allShownSelected =
    sorted.length > 0 && sorted.every((item) => selected.has(item.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allShownSelected) {
      sorted.forEach((item) => next.delete(item.id));
    } else {
      sorted.forEach((item) => next.add(item.id));
    }
    onSelectedChange(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange(next);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[1200px] divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th scope="col" className="w-10 px-3 py-2">
              <input
                type="checkbox"
                checked={allShownSelected}
                onChange={toggleAll}
                aria-label="Select all shown rows"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 dark:border-slate-600"
              />
            </th>
            <SortHeader label="Company" sortKey="company" active={sortKey === "company"} dir={sortDir} onClick={handleSort} />
            <SortHeader label="Sector" sortKey="sector" active={sortKey === "sector"} dir={sortDir} onClick={handleSort} />
            <th scope="col" className={headerCell}>Office</th>
            <SortHeader label="Research" sortKey="researchStatus" active={sortKey === "researchStatus"} dir={sortDir} onClick={handleSort} />
            <SortHeader label="Priority" sortKey="priority" active={sortKey === "priority"} dir={sortDir} onClick={handleSort} />
            <th scope="col" className={cx(headerCell, "text-center")}>Applied</th>
            <th scope="col" className={headerCell}>Status</th>
            <SortHeader label="Deadline" sortKey="deadline" active={sortKey === "deadline"} dir={sortDir} onClick={handleSort} />
            <SortHeader label="Follow up" sortKey="followUpDate" active={sortKey === "followUpDate"} dir={sortDir} onClick={handleSort} />
            <th scope="col" className={headerCell}>Contact</th>
            <th scope="col" className={headerCell}>Cover letter</th>
            <SortHeader label="Researched" sortKey="lastResearched" active={sortKey === "lastResearched"} dir={sortDir} onClick={handleSort} />
            <th scope="col" className={headerCell}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((item) => {
            const days = daysUntil(item.deadline);
            const tone = deadlineTone(days);
            const followUpDays = daysUntil(item.followUpDate);
            const isSelected = selected.has(item.id);
            return (
              <tr
                key={item.id}
                className={cx(
                  "group",
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                )}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(item.id)}
                    aria-label={`Select ${item.company}`}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 dark:border-slate-600"
                  />
                </td>
                <td className="max-w-[220px] px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="text-left text-sm font-medium text-slate-900 hover:underline dark:text-slate-50"
                    >
                      {item.company}
                    </button>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open posting"
                        aria-label={`Open ${item.company} posting in a new tab`}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  {item.citizenship && (
                    <div className="mt-0.5 truncate text-[11px] text-orange-600 dark:text-orange-400">
                      🔒 {item.citizenship}
                    </div>
                  )}
                  {isNoteTruncated(item) && (
                    <div
                      className="mt-0.5 text-[11px] text-amber-600 dark:text-amber-400"
                      title="This note was clipped when the original sheet was exported"
                    >
                      ✂️ note clipped
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.sector || "—"}
                  {item.size ? (
                    <span className="text-slate-400 dark:text-slate-500"> · {item.size}</span>
                  ) : null}
                </td>
                <td className="max-w-[180px] truncate px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.nearestOffice || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <ResearchBadge status={item.researchStatus} />
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <PriorityBadge priority={item.priority} />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.applied}
                    onChange={() => onToggleApplied(item.id)}
                    aria-label={`Mark ${item.company} as applied`}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <StatusBadge status={item.status} />
                </td>
                <td
                  className={cx(
                    "whitespace-nowrap px-3 py-2 text-sm",
                    tone === "overdue" && "font-medium text-rose-600 dark:text-rose-400",
                    tone === "soon" && "font-medium text-amber-600 dark:text-amber-400",
                    tone === "upcoming" && "text-slate-600 dark:text-slate-300",
                    tone === "none" && "text-slate-400 dark:text-slate-600",
                  )}
                >
                  {item.deadline ? formatDate(item.deadline) : "—"}
                </td>
                <td
                  className={cx(
                    "whitespace-nowrap px-3 py-2 text-sm",
                    followUpDays !== null && followUpDays <= 0
                      ? "font-medium text-sky-600 dark:text-sky-400"
                      : "text-slate-600 dark:text-slate-300",
                    !item.followUpDate && "text-slate-400 dark:text-slate-600",
                  )}
                >
                  {item.followUpDate ? formatDate(item.followUpDate) : "—"}
                </td>
                <td className="max-w-[160px] truncate px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.contact || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <CoverLetterBadge status={item.coverLetter} />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                  {item.lastResearched ? formatDate(item.lastResearched) : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove ${item.company} from your tracker?`)) {
                          onDelete(item.id);
                        }
                      }}
                      className="text-xs font-medium text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={14} className="px-3 py-10 text-center text-sm text-slate-400">
                No internships match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
