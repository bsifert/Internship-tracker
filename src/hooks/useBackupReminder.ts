import { useCallback, useState } from "react";

const BACKUP_KEY = "internship-tracker:lastBackupAt:v1";
const SNOOZE_KEY = "internship-tracker:backupSnoozedUntil:v1";

const STALE_AFTER_DAYS = 7;
const SNOOZE_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

function read(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const ms = Date.parse(raw);
    return Number.isNaN(ms) ? null : ms;
  } catch {
    return null;
  }
}

function write(key: string, when: Date) {
  try {
    localStorage.setItem(key, when.toISOString());
  } catch (err) {
    console.error("Failed to record backup state.", err);
  }
}

/**
 * Your data lives only in this browser, so nudge for a JSON backup when the
 * last one is stale (or has never happened). Snoozeable, never blocking.
 */
export function useBackupReminder() {
  const [lastBackupAt, setLastBackupAt] = useState<number | null>(() =>
    read(BACKUP_KEY),
  );
  const [snoozedUntil, setSnoozedUntil] = useState<number | null>(() =>
    read(SNOOZE_KEY),
  );

  const markBackedUp = useCallback(() => {
    const now = new Date();
    write(BACKUP_KEY, now);
    setLastBackupAt(now.getTime());
  }, []);

  const snooze = useCallback(() => {
    const until = new Date(Date.now() + SNOOZE_DAYS * DAY_MS);
    write(SNOOZE_KEY, until);
    setSnoozedUntil(until.getTime());
  }, []);

  const daysSinceBackup =
    lastBackupAt === null
      ? null
      : Math.floor((Date.now() - lastBackupAt) / DAY_MS);

  const isSnoozed = snoozedUntil !== null && snoozedUntil > Date.now();
  const isStale =
    daysSinceBackup === null || daysSinceBackup >= STALE_AFTER_DAYS;

  return {
    lastBackupAt,
    daysSinceBackup,
    shouldRemind: isStale && !isSnoozed,
    markBackedUp,
    snooze,
  };
}
