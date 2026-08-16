import type { Internship } from "../types";
import { PRIORITY_WEIGHT, daysUntil } from "./utils";

export type ActionTone = "overdue" | "soon" | "followup" | "live";

export interface ActionItem {
  item: Internship;
  /** Lower is more urgent. */
  score: number;
  reason: string;
  tone: ActionTone;
}

/** Statuses where the ball is no longer in your court. */
const CLOSED_STATUSES = new Set(["Offer", "Rejected", "Withdrawn"]);

/**
 * Work out the single most pressing reason to act on a company right now,
 * or null when there's nothing to chase.
 */
export function actionFor(item: Internship): ActionItem | null {
  if (CLOSED_STATUSES.has(item.status)) return null;

  const deadlineDays = daysUntil(item.deadline);
  const followUpDays = daysUntil(item.followUpDate);
  const priorityBump = PRIORITY_WEIGHT[item.priority];

  if (!item.applied && deadlineDays !== null && deadlineDays < 0) {
    return {
      item,
      score: 0 + priorityBump,
      reason: `Deadline passed ${Math.abs(deadlineDays)}d ago`,
      tone: "overdue",
    };
  }

  if (followUpDays !== null && followUpDays <= 0) {
    return {
      item,
      score: 5 + priorityBump,
      reason:
        followUpDays === 0
          ? "Follow up today"
          : `Follow-up ${Math.abs(followUpDays)}d overdue`,
      tone: "followup",
    };
  }

  if (!item.applied && deadlineDays !== null && deadlineDays <= 7) {
    return {
      item,
      score: 10 + deadlineDays + priorityBump,
      reason:
        deadlineDays === 0
          ? "Deadline is today"
          : `Deadline in ${deadlineDays}d`,
      tone: "soon",
    };
  }

  if (!item.applied && item.researchStatus === "LIVE") {
    return {
      item,
      score: 20 + priorityBump,
      reason: "Posting is live — apply now",
      tone: "live",
    };
  }

  if (!item.applied && deadlineDays !== null && deadlineDays <= 30) {
    return {
      item,
      score: 30 + deadlineDays + priorityBump,
      reason: `Deadline in ${deadlineDays}d`,
      tone: "soon",
    };
  }

  if (
    !item.applied &&
    item.researchStatus === "IMMINENT" &&
    item.priority === "High"
  ) {
    return {
      item,
      score: 40,
      reason: "Opens soon — prep materials",
      tone: "live",
    };
  }

  return null;
}

/** Everything worth acting on, most urgent first. */
export function nextActions(items: Internship[]): ActionItem[] {
  return items
    .map(actionFor)
    .filter((action): action is ActionItem => action !== null)
    .sort((a, b) => a.score - b.score || a.item.company.localeCompare(b.item.company));
}

/**
 * Board ordering: real time pressure first, then priority, then name.
 * Applied rows always sink to the bottom of their column.
 */
export function compareByUrgency(a: Internship, b: Internship): number {
  if (a.applied !== b.applied) return a.applied ? 1 : -1;

  const scoreA = actionFor(a)?.score ?? Number.POSITIVE_INFINITY;
  const scoreB = actionFor(b)?.score ?? Number.POSITIVE_INFINITY;
  if (scoreA !== scoreB) return scoreA - scoreB;

  const priority = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  if (priority !== 0) return priority;

  return a.company.localeCompare(b.company);
}
