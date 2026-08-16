import { useMemo } from "react";
import type { Internship } from "../types";
import { cx, daysUntil } from "../lib/utils";

function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneClasses = {
    default: "text-slate-900 dark:text-slate-50",
    good: "text-emerald-600 dark:text-emerald-400",
    warn: "text-amber-600 dark:text-amber-400",
    bad: "text-rose-600 dark:text-rose-400",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={cx("mt-1 text-2xl font-semibold tabular-nums", toneClasses)}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</div>}
    </div>
  );
}

export function Dashboard({ items }: { items: Internship[] }) {
  const stats = useMemo(() => {
    const total = items.length;
    const applied = items.filter((i) => i.applied).length;
    const live = items.filter((i) => i.researchStatus === "LIVE").length;
    const imminent = items.filter((i) => i.researchStatus === "IMMINENT").length;
    const highPriorityOpen = items.filter(
      (i) => i.priority === "High" && !i.applied,
    ).length;
    const coverLettersReady = items.filter(
      (i) =>
        i.coverLetter === "Drafted" ||
        i.coverLetter === "Complete" ||
        i.coverLetter === "Submitted",
    ).length;
    const withContact = items.filter((i) => i.contact.trim().length > 0).length;
    const dueSoon = items.filter((i) => {
      const d = daysUntil(i.deadline);
      return d !== null && d >= 0 && d <= 14 && !i.applied;
    }).length;
    const overdue = items.filter((i) => {
      const d = daysUntil(i.deadline);
      return d !== null && d < 0 && !i.applied;
    }).length;
    const interviewing = items.filter(
      (i) => i.status === "Interviewing" || i.status === "Offer",
    ).length;

    return {
      total,
      applied,
      live,
      imminent,
      highPriorityOpen,
      coverLettersReady,
      withContact,
      dueSoon,
      overdue,
      interviewing,
    };
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label="Tracked" value={stats.total} sub="total companies" />
      <StatCard
        label="Applied"
        value={`${stats.applied} / ${stats.total}`}
        sub={
          stats.total
            ? `${Math.round((stats.applied / stats.total) * 100)}% of list`
            : undefined
        }
        tone="good"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        sub="deadline passed, not applied"
        tone={stats.overdue > 0 ? "bad" : "default"}
      />
      <StatCard
        label="Due within 14d"
        value={stats.dueSoon}
        sub="not applied yet"
        tone={stats.dueSoon > 0 ? "warn" : "default"}
      />
      <StatCard
        label="High priority, not applied"
        value={stats.highPriorityOpen}
        sub="apply next"
        tone={stats.highPriorityOpen > 0 ? "bad" : "default"}
      />
      <StatCard label="Live now" value={stats.live} sub="postings open" tone="good" />
      <StatCard label="Imminent" value={stats.imminent} sub="opening soon" tone="warn" />
      <StatCard
        label="Cover letters"
        value={stats.coverLettersReady}
        sub="drafted or further"
      />
      <StatCard label="Have a contact" value={stats.withContact} sub="warm intro possible" />
      <StatCard
        label="In play"
        value={stats.interviewing}
        sub="interviewing or offer"
        tone={stats.interviewing > 0 ? "good" : "default"}
      />
    </div>
  );
}
