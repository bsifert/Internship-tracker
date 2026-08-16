import { useMemo } from "react";
import type { Internship, ResearchStatus } from "../types";
import { RESEARCH_STATUSES } from "../types";
import { compareByUrgency } from "../lib/urgency";
import { InternshipCard } from "./InternshipCard";
import { ResearchBadge } from "./Badges";

const COLUMN_HINTS: Record<ResearchStatus, string> = {
  LIVE: "Postings are open right now — apply immediately.",
  IMMINENT: "Expected to open soon — have materials ready.",
  WATCH: "No confirmed timeline yet — check back periodically.",
  UNRESEARCHED: "Not yet researched — lowest urgency until reviewed.",
};

export function BoardView({
  items,
  onEdit,
  onToggleApplied,
}: {
  items: Internship[];
  onEdit: (item: Internship) => void;
  onToggleApplied: (id: string) => void;
}) {
  const groups = useMemo(() => {
    const byStatus = new Map<ResearchStatus, Internship[]>();
    for (const status of RESEARCH_STATUSES) byStatus.set(status, []);
    for (const item of items) {
      byStatus.get(item.researchStatus)?.push(item);
    }
    for (const list of byStatus.values()) {
      list.sort(compareByUrgency);
    }
    return byStatus;
  }, [items]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {RESEARCH_STATUSES.map((status) => {
        const list = groups.get(status) ?? [];
        return (
          <div key={status} className="flex flex-col gap-3">
            <div className="rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <ResearchBadge status={status} />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {list.length}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {COLUMN_HINTS[status]}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {list.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
                  Nothing here
                </div>
              )}
              {list.map((item) => (
                <InternshipCard
                  key={item.id}
                  item={item}
                  onEdit={() => onEdit(item)}
                  onToggleApplied={() => onToggleApplied(item.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
