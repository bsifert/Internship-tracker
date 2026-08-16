import type {
  ApplicationStatus,
  CoverLetterStatus,
  Priority,
  ResearchStatus,
} from "../types";
import { cx } from "../lib/utils";

const base =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap";

const priorityStyles: Record<Priority, string> = {
  High: "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30",
  Medium:
    "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  Low: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-500/30",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={cx(base, priorityStyles[priority])}>{priority}</span>;
}

const researchStyles: Record<ResearchStatus, string> = {
  LIVE: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  IMMINENT:
    "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30",
  WATCH:
    "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30",
  UNRESEARCHED:
    "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20",
};

export function ResearchBadge({ status }: { status: ResearchStatus }) {
  const dot: Record<ResearchStatus, string> = {
    LIVE: "bg-emerald-500",
    IMMINENT: "bg-sky-500",
    WATCH: "bg-violet-500",
    UNRESEARCHED: "bg-slate-400",
  };
  return (
    <span className={cx(base, researchStyles[status])}>
      <span className={cx("h-1.5 w-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}

const statusStyles: Record<ApplicationStatus, string> = {
  "Not Started":
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-500/30",
  "In Progress":
    "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  Applied:
    "bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  Interviewing:
    "bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/30",
  Offer:
    "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  Rejected:
    "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30",
  Withdrawn:
    "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={cx(base, statusStyles[status])}>{status}</span>;
}

const coverStyles: Record<CoverLetterStatus, string> = {
  None: "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20",
  Drafted:
    "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  Complete:
    "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  Submitted:
    "bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
};

export function CoverLetterBadge({ status }: { status: CoverLetterStatus }) {
  if (status === "None") {
    return <span className={cx(base, coverStyles[status])}>No cover letter</span>;
  }
  return <span className={cx(base, coverStyles[status])}>{status}</span>;
}
