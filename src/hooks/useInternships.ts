import { useCallback, useEffect, useState } from "react";
import type {
  ApplicationStatus,
  Internship,
  NewInternship,
  StatusEvent,
} from "../types";
import type { CsvRow } from "../lib/csv";
import { seedInternships } from "../data/seed";

const STORAGE_KEY = "internship-tracker:data:v1";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

/**
 * Fill in any fields a record is missing.
 *
 * Data saved by an earlier version of the app predates `url`, `followUpDate`
 * and `history`, so every record read from localStorage (or from an imported
 * backup) goes through here. Without this, older saved data would render as
 * `undefined` and crash on `.trim()`/`.map()`.
 */
function normalize(raw: Partial<Internship> | undefined | null): Internship {
  const record = raw ?? {};
  const history: StatusEvent[] = Array.isArray(record.history)
    ? record.history.filter(
        (event): event is StatusEvent =>
          !!event && typeof event === "object" && typeof event.to === "string",
      )
    : [];

  return {
    id: str(record.id) || makeId(),
    company: str(record.company),
    sector: str(record.sector),
    size: (record.size ?? "") as Internship["size"],
    nearestOffice: str(record.nearestOffice),
    url: str(record.url),
    researchStatus: (record.researchStatus ??
      "UNRESEARCHED") as Internship["researchStatus"],
    priority: (record.priority ?? "Medium") as Internship["priority"],
    citizenship: str(record.citizenship),
    applied: Boolean(record.applied),
    status: (record.status ?? "Not Started") as ApplicationStatus,
    deadline: str(record.deadline),
    followUpDate: str(record.followUpDate),
    contact: str(record.contact),
    coverLetter: (record.coverLetter ?? "None") as Internship["coverLetter"],
    myNotes: str(record.myNotes),
    researchNotes: str(record.researchNotes),
    lastResearched: str(record.lastResearched),
    history,
    createdAt: str(record.createdAt) || new Date().toISOString(),
    updatedAt: str(record.updatedAt) || new Date().toISOString(),
  };
}

export function normalizeAll(rows: unknown): Internship[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => normalize(row as Partial<Internship>));
}

function loadInitial(): Internship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeAll(parsed);
    }
  } catch (err) {
    console.error(
      "Failed to read saved internship data, falling back to seed data.",
      err,
    );
  }
  // First run in this browser: seed from the original Google Sheet export.
  return normalizeAll(seedInternships);
}

/** Append a timeline entry when (and only when) the status actually moves. */
function withStatusHistory(
  item: Internship,
  nextStatus: ApplicationStatus,
): StatusEvent[] {
  if (item.status === nextStatus) return item.history;
  return [
    ...item.history,
    { at: new Date().toISOString(), from: item.status, to: nextStatus },
  ];
}

export function useInternships() {
  const [items, setItems] = useState<Internship[]>(loadInitial);
  const [lastSavedAt, setLastSavedAt] = useState<number>(Date.now());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setLastSavedAt(Date.now());
    } catch (err) {
      console.error("Failed to save internship data to localStorage.", err);
    }
  }, [items]);

  const addInternship = useCallback((data: NewInternship) => {
    const now = new Date().toISOString();
    const entry: Internship = {
      ...data,
      id: makeId(),
      history: [{ at: now, from: null, to: data.status }],
      createdAt: now,
      updatedAt: now,
    };
    setItems((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const updateInternship = useCallback((id: string, data: NewInternship) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              id,
              history: withStatusHistory(item, data.status),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }, []);

  const deleteInternship = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const deleteMany = useCallback((ids: string[]) => {
    const doomed = new Set(ids);
    setItems((prev) => prev.filter((item) => !doomed.has(item.id)));
  }, []);

  const toggleApplied = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const applied = !item.applied;
        // Flipping the checkbox on a brand-new row implies you just applied.
        const status: ApplicationStatus =
          applied && item.status === "Not Started" ? "Applied" : item.status;
        return {
          ...item,
          applied,
          status,
          history: withStatusHistory(item, status),
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  /** Apply the same partial change to many rows at once. */
  const bulkUpdate = useCallback(
    (ids: string[], patch: Partial<NewInternship>) => {
      const targets = new Set(ids);
      setItems((prev) =>
        prev.map((item) => {
          if (!targets.has(item.id)) return item;
          const nextStatus = patch.status ?? item.status;
          return {
            ...item,
            ...patch,
            id: item.id,
            history: withStatusHistory(item, nextStatus),
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  const replaceAll = useCallback((next: unknown) => {
    setItems(normalizeAll(next));
  }, []);

  /**
   * Merge imported rows in, matching on company name so re-imports update
   * rather than duplicate. Rows are partial: only the columns the file
   * actually had are applied, so importing a narrow sheet never clears
   * fields it didn't mention.
   */
  const mergeIn = useCallback((incoming: CsvRow[]) => {
    setItems((prev) => {
      const byCompany = new Map(
        prev.map((item) => [item.company.trim().toLowerCase(), item]),
      );
      for (const row of incoming) {
        const key = row.company.trim().toLowerCase();
        if (!key) continue;
        const existing = byCompany.get(key);
        if (existing) {
          const nextStatus = row.status ?? existing.status;
          byCompany.set(key, {
            ...existing,
            ...row,
            id: existing.id,
            history: withStatusHistory(existing, nextStatus),
            updatedAt: new Date().toISOString(),
          });
        } else {
          byCompany.set(key, normalize(row));
        }
      }
      return Array.from(byCompany.values());
    });
  }, []);

  const resetToSeed = useCallback(() => {
    setItems(normalizeAll(seedInternships));
  }, []);

  return {
    items,
    lastSavedAt,
    addInternship,
    updateInternship,
    deleteInternship,
    deleteMany,
    toggleApplied,
    bulkUpdate,
    replaceAll,
    mergeIn,
    resetToSeed,
  };
}
