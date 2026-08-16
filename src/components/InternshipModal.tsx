import { useEffect, useState } from "react";
import type { Internship, NewInternship } from "../types";
import {
  APPLICATION_STATUSES,
  COVER_LETTER_STATUSES,
  PRIORITIES,
  RESEARCH_STATUSES,
  SIZES,
  emptyInternship,
} from "../types";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-600";

const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400";

export function InternshipModal({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: Internship | null;
  onClose: () => void;
  onSave: (data: NewInternship) => void;
  onDelete?: (id: string) => void;
}) {
  const [form, setForm] = useState<NewInternship>(item ?? emptyInternship);

  useEffect(() => {
    setForm(item ?? emptyInternship);
  }, [item]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const set = <K extends keyof NewInternship>(key: K, value: NewInternship[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim()) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-sm sm:pt-16"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {item ? `Edit ${item.company}` : "Add internship"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Company *</label>
              <input
                required
                autoFocus
                className={inputClass}
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. Burns & McDonnell"
              />
            </div>
            <div>
              <label className={labelClass}>Sector</label>
              <input
                className={inputClass}
                value={form.sector}
                onChange={(e) => set("sector", e.target.value)}
                placeholder="e.g. Civil/Environmental"
              />
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <select
                className={inputClass}
                value={form.size}
                onChange={(e) => set("size", e.target.value as NewInternship["size"])}
              >
                <option value="">Unknown</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Nearest office</label>
              <input
                className={inputClass}
                value={form.nearestOffice}
                onChange={(e) => set("nearestOffice", e.target.value)}
                placeholder="e.g. Parsippany, NJ"
              />
            </div>

            <div>
              <label className={labelClass}>Research status</label>
              <select
                className={inputClass}
                value={form.researchStatus}
                onChange={(e) =>
                  set("researchStatus", e.target.value as NewInternship["researchStatus"])
                }
              >
                {RESEARCH_STATUSES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority / urgency</label>
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as NewInternship["priority"])}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>US citizenship / clearance requirement</label>
              <input
                className={inputClass}
                value={form.citizenship}
                onChange={(e) => set("citizenship", e.target.value)}
                placeholder="Leave blank if none, or e.g. YES - citizenship required"
              />
            </div>

            <div>
              <label className={labelClass}>Application status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => set("status", e.target.value as NewInternship["status"])}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={form.applied}
                  onChange={(e) => set("applied", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                />
                Applied
              </label>
            </div>

            <div>
              <label className={labelClass}>Deadline</label>
              <input
                type="date"
                className={inputClass}
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Last researched</label>
              <input
                type="date"
                className={inputClass}
                value={form.lastResearched}
                onChange={(e) => set("lastResearched", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Contact</label>
              <input
                className={inputClass}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                placeholder="Name, role, or how you know them"
              />
            </div>

            <div>
              <label className={labelClass}>Cover letter</label>
              <select
                className={inputClass}
                value={form.coverLetter}
                onChange={(e) =>
                  set("coverLetter", e.target.value as NewInternship["coverLetter"])
                }
              >
                {COVER_LETTER_STATUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>My notes</label>
              <textarea
                className={inputClass}
                rows={3}
                value={form.myNotes}
                onChange={(e) => set("myNotes", e.target.value)}
                placeholder="Anything you want to remember"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Research notes</label>
              <textarea
                className={inputClass}
                rows={3}
                value={form.researchNotes}
                onChange={(e) => set("researchNotes", e.target.value)}
                placeholder="Findings from research"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              {item && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${item.company} from your tracker?`)) {
                      onDelete(item.id);
                      onClose();
                    }
                  }}
                  className="text-sm font-medium text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                {item ? "Save changes" : "Add internship"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
