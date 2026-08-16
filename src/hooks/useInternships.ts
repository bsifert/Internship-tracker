import { useCallback, useEffect, useState } from "react";
import type { Internship, NewInternship } from "../types";
import { seedInternships } from "../data/seed";

const STORAGE_KEY = "internship-tracker:data:v1";

function loadInitial(): Internship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Internship[];
    }
  } catch (err) {
    console.error("Failed to read saved internship data, falling back to seed data.", err);
  }
  // First run on this browser: seed from the original Google Sheet export.
  return seedInternships;
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
          ? { ...item, ...data, id, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  }, []);

  const deleteInternship = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleApplied = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              applied: !item.applied,
              status:
                !item.applied && item.status === "Not Started"
                  ? "Applied"
                  : item.status,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }, []);

  const replaceAll = useCallback((next: Internship[]) => {
    setItems(next);
  }, []);

  const resetToSeed = useCallback(() => {
    setItems(seedInternships);
  }, []);

  return {
    items,
    lastSavedAt,
    addInternship,
    updateInternship,
    deleteInternship,
    toggleApplied,
    replaceAll,
    resetToSeed,
  };
}
