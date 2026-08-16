import { useRef, useState } from "react";
import type { Internship } from "../types";
import { downloadCsv, downloadJson } from "../lib/csv";
import { cx } from "../lib/utils";

export function DataMenu({
  items,
  onImport,
  onReset,
}: {
  items: Internship[];
  onImport: (items: Internship[]) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error("Expected an array");
        const required = ["id", "company"];
        for (const row of parsed) {
          for (const key of required) {
            if (!(key in row)) throw new Error(`Missing "${key}" field in one or more rows`);
          }
        }
        onImport(parsed as Internship[]);
        alert(`Imported ${parsed.length} internships.`);
      } catch (err) {
        alert(
          `Couldn't import that file. Make sure it's a JSON backup exported from this app.\n\n${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Data ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={cx(
              "absolute right-0 z-20 mt-1 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900",
            )}
          >
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => {
                downloadJson(items);
                setOpen(false);
              }}
            >
              Export JSON backup
            </button>
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => {
                downloadCsv(items);
                setOpen(false);
              }}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => {
                fileInputRef.current?.click();
                setOpen(false);
              }}
            >
              Import JSON backup
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              onClick={() => {
                setOpen(false);
                if (
                  confirm(
                    "Reset all data back to the original Google Sheet import? This will erase any changes you've made.",
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
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
