import { useMemo, useState } from "react";
import type { Internship } from "./types";
import { useInternships } from "./hooks/useInternships";
import { Dashboard } from "./components/Dashboard";
import { FilterBar } from "./components/FilterBar";
import { BoardView } from "./components/BoardView";
import { TableView } from "./components/TableView";
import { InternshipModal } from "./components/InternshipModal";
import { DataMenu } from "./components/DataMenu";
import { defaultFilters, type Filters, type View } from "./lib/filterTypes";

function App() {
  const {
    items,
    lastSavedAt,
    addInternship,
    updateInternship,
    deleteInternship,
    toggleApplied,
    replaceAll,
    resetToSeed,
  } = useInternships();

  const [view, setView] = useState<View>("board");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [modalItem, setModalItem] = useState<Internship | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const closeModal = () => setModalOpen(false);

  const handleSave = (data: Omit<Internship, "id" | "createdAt" | "updatedAt">) => {
    if (modalItem) {
      updateInternship(modalItem.id, data);
    } else {
      addInternship(data);
    }
    setModalOpen(false);
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
            <DataMenu items={items} onImport={replaceAll} onReset={resetToSeed} />
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
        <Dashboard items={items} />

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
          />
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 text-xs text-slate-400 dark:text-slate-600">
        Autosaved to this browser at {new Date(lastSavedAt).toLocaleTimeString()}. Use
        "Data → Export JSON backup" to keep a copy or move to another device.
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
