import type { Internship } from "../types";
import { CoverLetterBadge, PriorityBadge, StatusBadge } from "./Badges";
import { cx, daysUntil, deadlineTone, formatDate } from "../lib/utils";

export function InternshipCard({
  item,
  onEdit,
  onToggleApplied,
}: {
  item: Internship;
  onEdit: () => void;
  onToggleApplied: () => void;
}) {
  const days = daysUntil(item.deadline);
  const tone = deadlineTone(days);

  return (
    <div
      className={cx(
        "group rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900",
        item.applied
          ? "border-emerald-200 dark:border-emerald-900/60"
          : "border-slate-200 dark:border-slate-800",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-left text-sm font-semibold text-slate-900 hover:underline dark:text-slate-50"
        >
          {item.company}
        </button>
        <PriorityBadge priority={item.priority} />
      </div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {item.sector || "—"}
        {item.size ? ` · ${item.size}` : ""}
      </div>
      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {item.nearestOffice || "Office unknown"}
      </div>

      {item.citizenship && (
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/20">
          🔒 {item.citizenship}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={item.status} />
        <CoverLetterBadge status={item.coverLetter} />
      </div>

      {item.contact && (
        <div className="mt-2 truncate text-xs text-slate-600 dark:text-slate-300">
          👤 {item.contact}
        </div>
      )}

      {item.deadline && (
        <div
          className={cx(
            "mt-2 text-xs font-medium",
            tone === "overdue" && "text-rose-600 dark:text-rose-400",
            tone === "soon" && "text-amber-600 dark:text-amber-400",
            tone === "upcoming" && "text-slate-500 dark:text-slate-400",
          )}
        >
          Deadline {formatDate(item.deadline)}
          {days !== null && (
            <span>
              {" "}
              ({days === 0 ? "today" : days > 0 ? `${days}d left` : `${Math.abs(days)}d overdue`})
            </span>
          )}
        </div>
      )}

      {item.researchNotes && (
        <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {item.researchNotes}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={item.applied}
            onChange={onToggleApplied}
            className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
          />
          Applied
        </label>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-slate-500 opacity-0 transition-opacity hover:text-slate-900 group-hover:opacity-100 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Edit →
        </button>
      </div>
    </div>
  );
}
