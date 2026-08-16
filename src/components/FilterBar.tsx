import type { AppliedFilter, Filters, View } from "../lib/filterTypes";
import { PRIORITIES, RESEARCH_STATUSES } from "../types";
import { cx } from "../lib/utils";

export function FilterBar({
  filters,
  onChange,
  sectors,
  view,
  onViewChange,
  resultCount,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  sectors: string[];
  view: View;
  onViewChange: (v: View) => void;
  resultCount: number;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-slate-600";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search company, sector, office, notes…"
          className="w-full min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-600 sm:max-w-xs"
        />
        <select
          className={selectClass}
          value={filters.priority}
          onChange={(e) => set("priority", e.target.value as Filters["priority"])}
        >
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p} priority
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.research}
          onChange={(e) => set("research", e.target.value as Filters["research"])}
        >
          <option value="All">All research statuses</option>
          {RESEARCH_STATUSES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.applied}
          onChange={(e) => set("applied", e.target.value as AppliedFilter)}
        >
          <option value="All">Applied &amp; not applied</option>
          <option value="Applied">Applied only</option>
          <option value="Not Applied">Not applied yet</option>
        </select>
        <select
          className={selectClass}
          value={filters.sector}
          onChange={(e) => set("sector", e.target.value)}
        >
          <option value="All">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {resultCount} shown
        </span>
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => onViewChange("board")}
          className={cx(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "board"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
          )}
        >
          Urgency board
        </button>
        <button
          type="button"
          onClick={() => onViewChange("table")}
          className={cx(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "table"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
          )}
        >
          Table
        </button>
      </div>
    </div>
  );
}
