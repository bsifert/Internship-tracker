import { useRef, useState } from "react";
import type { Internship } from "../types";
import type { CsvRow } from "../lib/csv";
import { csvToRows, downloadCsv, downloadJson } from "../lib/csv";
import { normalizeAll } from "../hooks/useInternships";

const menuItem =
  "block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800";

export function DataMenu({
  items,
  onReplaceAll,
  onMergeIn,
  onReset,
  onBackedUp,
}: {
  items: Internship[];
  onReplaceAll: (items: Internship[]) => void;
  onMergeIn: (rows: CsvRow[]) => void;
  onReset: () => void;
  onBackedUp: () => void;
}) {
  const [open, setOpen] = useState(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const readFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    handler: (text: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        handler(String(reader.result));
      } catch (err) {
        alert(
          `Couldn't import that file.\n\n${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleJson = (text: string) => {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Expected a JSON array.");
    const rows = normalizeAll(parsed);
    if (rows.length === 0) throw new Error("That file contained no rows.");
    if (
      !confirm(
        `Replace your current ${items.length} rows with ${rows.length} from this backup?`,
      )
    ) {
      return;
    }
    onReplaceAll(rows);
  };

  const handleCsv = (text: string) => {
    const rows = csvToRows(text);
    if (rows.length === 0) {
      throw new Error("No rows with a Company value were found.");
    }
    if (
      !confirm(
        `Merge ${rows.length} rows from this CSV?\n\n` +
          "Companies you already track will be updated; new ones added. " +
          "Nothing is deleted, and columns missing from the file are left alone.",
      )
    ) {
      return;
    }
    onMergeIn(rows);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Data ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 z-20 mt-1 w-60 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                downloadJson(items);
                onBackedUp();
                setOpen(false);
              }}
            >
              Export JSON backup
            </button>
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                downloadCsv(items);
                setOpen(false);
              }}
            >
              Export CSV
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                jsonInputRef.current?.click();
                setOpen(false);
              }}
            >
              Restore from JSON backup
            </button>
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                csvInputRef.current?.click();
                setOpen(false);
              }}
            >
              Import / merge a CSV
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              onClick={() => {
                setOpen(false);
                if (
                  confirm(
                    "Reset all data back to the original Google Sheet import? This erases every change you've made.",
                  )
                ) {
                  onReset();
                }
              }}
            >
              Reset to original sheet data
            </button>
          </div>
        </>
      )}
      <input
        ref={jsonInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => readFile(e, handleJson)}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept="text/csv,.csv"
        className="hidden"
        onChange={(e) => readFile(e, handleCsv)}
      />
    </div>
  );
}
