import type { NewInternship } from "../types";
import {
  APPLICATION_STATUSES,
  COVER_LETTER_STATUSES,
  PRIORITIES,
  RESEARCH_STATUSES,
} from "../types";

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";

export function BulkBar({
  count,
  onPatch,
  onDelete,
  onClear,
}: {
  count: number;
  onPatch: (patch: Partial<NewInternship>) => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-30 mx-auto flex w-fit max-w-full flex-wrap items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <span className="px-1 text-sm font-medium text-white">
        {count} selected
      </span>

      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          if (!e.target.value) return;
          onPatch({ status: e.target.value as NewInternship["status"] });
          e.target.value = "";
        }}
        aria-label="Set application status for selected"
      >
        <option value="">Set status…</option>
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          if (!e.target.value) return;
          onPatch({ priority: e.target.value as NewInternship["priority"] });
          e.target.value = "";
        }}
        aria-label="Set priority for selected"
      >
        <option value="">Set priority…</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          if (!e.target.value) return;
          onPatch({
            researchStatus: e.target.value as NewInternship["researchStatus"],
          });
          e.target.value = "";
        }}
        aria-label="Set research status for selected"
      >
        <option value="">Set research…</option>
        {RESEARCH_STATUSES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value=""
        onChange={(e) => {
          if (!e.target.value) return;
          onPatch({
            coverLetter: e.target.value as NewInternship["coverLetter"],
          });
          e.target.value = "";
        }}
        aria-label="Set cover letter status for selected"
      >
        <option value="">Set cover letter…</option>
        {COVER_LETTER_STATUSES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onPatch({ applied: true })}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Mark applied
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
      >
        Delete
      </button>
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-300 hover:text-white"
      >
        Clear
      </button>
    </div>
  );
}
