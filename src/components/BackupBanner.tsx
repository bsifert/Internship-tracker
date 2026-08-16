export function BackupBanner({
  daysSinceBackup,
  onBackup,
  onSnooze,
}: {
  daysSinceBackup: number | null;
  onBackup: () => void;
  onSnooze: () => void;
}) {
  const message =
    daysSinceBackup === null
      ? "Your tracker lives only in this browser. Clearing site data — or switching to another device — loses it."
      : `Your last backup was ${daysSinceBackup} days ago. This data lives only in this browser.`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex-1">
        <span aria-hidden="true">⚠️ </span>
        {message}
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onBackup}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
        >
          Download backup
        </button>
        <button
          type="button"
          onClick={onSnooze}
          className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-500/40 dark:text-amber-200 dark:hover:bg-amber-500/10"
        >
          Remind me later
        </button>
      </div>
    </div>
  );
}
