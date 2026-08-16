import type { Priority, ResearchStatus } from "../types";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export const RESEARCH_WEIGHT: Record<ResearchStatus, number> = {
  LIVE: 0,
  IMMINENT: 1,
  WATCH: 2,
  UNRESEARCHED: 3,
};

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(iso: string): number | null {
  if (!iso) return null;
  const target = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ms = target.getTime() - startOfToday.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function deadlineTone(days: number | null): "overdue" | "soon" | "upcoming" | "none" {
  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days <= 7) return "soon";
  return "upcoming";
}
