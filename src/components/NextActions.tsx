import { useMemo, useState } from "react";
import type { Internship } from "../types";
import { nextActions, type ActionTone } from "../lib/urgency";
import { cx } from "../lib/utils";

const TONE_STYLES: Record<ActionTone, string> = {
  overdue:
    "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30",
  soon: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  followup:
    "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30",
  live: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
};

const COLLAPSED_COUNT = 5;

export function NextActions({
  items,
  onEdit,
  onToggleApplied,
}: {
  items: Internship[];
  onEdit: (item: Internship) => void;
  onToggleApplied: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const actions = useMemo(() => nextActions(items), [items]);

  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-500/10 dark:text-emerald-300">
        Nothing needs chasing right now. Add deadlines or follow-up dates and
        they'll show up here.
      </div>
    );
  }

  const shown = expanded ? actions : actions.slice(0, COLLAPSED_COUNT);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Do these next
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {actions.length} need attention
        </span>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {shown.map(({ item, reason, tone }) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            <input
              type="checkbox"
              checked={item.applied}
              onChange={() => onToggleApplied(item.id)}
              aria-label={`Mark ${item.company} as applied`}
              className="h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
            />
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="text-sm font-medium text-slate-900 hover:underline dark:text-slate-50"
            >
              {item.company}
            </button>
            <span
              className={cx(
                "rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                TONE_STYLES[tone],
              )}
            >
              {reason}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {item.nearestOffice}
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Open posting →
              </a>
            )}
          </li>
        ))}
      </ul>
      {actions.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full rounded-b-xl border-t border-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
        >
          {expanded
            ? "Show less"
            : `Show ${actions.length - COLLAPSED_COUNT} more`}
        </button>
      )}
    </section>
  );
}
