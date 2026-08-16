import { useCallback, useMemo, useState } from "react";
import type { Internship, NewInternship } from "./types";
import { useInternships } from "./hooks/useInternships";
import { useBackupReminder } from "./hooks/useBackupReminder";
import { Dashboard } from "./components/Dashboard";
import { NextActions } from "./components/NextActions";
import { BackupBanner } from "./components/BackupBanner";
import { FilterBar } from "./components/FilterBar";
import { BoardView } from "./components/BoardView";
import { TableView } from "./components/TableView";
import { BulkBar } from "./components/BulkBar";
import { InternshipModal } from "./components/InternshipModal";
import { DataMenu } from "./components/DataMenu";
import { downloadJson } from "./lib/csv";
import { defaultFilters, type Filters, type View } from "./lib/filterTypes";

function App() {
  const {
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
  } = useInternships();

  const { daysSinceBackup, shouldRemind, markBackedUp, snooze } =
    useBackupReminder();

  const [view, setView] = useState<View>("board");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [modalItem, setModalItem] = useState<Internship | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sectors = useMemo(() => {
    const set = new Set(items.map((i) => i.sector.trim()).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return items.filter((item) => {
      if (filters.priority !== "All" && item.priority !== filters.priority) return false;
      if (filters.research !== "All" && item.researchStatus !== filters.research) return false;
      if (filters.applied === "Applied" && !item.applied) return false;
      if (filters.applied === "Not Applied" && item.applied) return false;
      if (filters.sector !== "All" && item.sector !== filters.sector) return false;
      if (q) {
        const haystack = [
          item.company,
          item.sector,
          item.nearestOffice,
          item.contact,
          item.myNotes,
          item.researchNotes,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, filters]);

  const openAddModal = () => {
    setModalItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: Internship) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleSave = (data: NewInternship) => {
    if (modalItem) {
      updateInternship(modalItem.id, data);
    } else {
      addInternship(data);
    }
    setModalOpen(false);
  };

  const handleBackupNow = () => {
    downloadJson(items);
    markBackedUp();
  };

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const handleBulkDelete = () => {
    if (
      confirm(
        `Remove ${selectedIds.length} companies from your tracker? This can't be undone.`,
      )
    ) {
      deleteMany(selectedIds);
      clearSelection();
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Internship Tracker
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Summer 2027 search · saved automatically in this browser
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataMenu
              items={items}
              onReplaceAll={replaceAll}
              onMergeIn={mergeIn}
              onReset={resetToSeed}
              onBackedUp={markBackedUp}
            />
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              + Add internship
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {shouldRemind && (
          <BackupBanner
            daysSinceBackup={daysSinceBackup}
            onBackup={handleBackupNow}
            onSnooze={snooze}
          />
        )}

        <Dashboard items={items} />

        <NextActions
          items={items}
          onEdit={openEditModal}
          onToggleApplied={toggleApplied}
        />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          sectors={sectors}
          view={view}
          onViewChange={setView}
          resultCount={filtered.length}
        />

        {view === "board" ? (
          <BoardView items={filtered} onEdit={openEditModal} onToggleApplied={toggleApplied} />
        ) : (
          <TableView
            items={filtered}
            onEdit={openEditModal}
            onToggleApplied={toggleApplied}
            onDelete={deleteInternship}
            selected={selected}
            onSelectedChange={setSelected}
          />
        )}

        {view === "table" && selectedIds.length > 0 && (
          <BulkBar
            count={selectedIds.length}
            onPatch={(patch) => bulkUpdate(selectedIds, patch)}
            onDelete={handleBulkDelete}
            onClear={clearSelection}
          />
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 text-xs text-slate-400 dark:text-slate-600">
        Autosaved to this browser at {new Date(lastSavedAt).toLocaleTimeString()}. Use
        “Data → Export JSON backup” to keep a copy or move to another device.
      </footer>

      {modalOpen && (
        <InternshipModal
          item={modalItem}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={deleteInternship}
        />
      )}
    </div>
  );
}

export default App;
