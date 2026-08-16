import type { Priority, ResearchStatus } from "../types";

export type AppliedFilter = "All" | "Applied" | "Not Applied";
export type View = "board" | "table";

export interface Filters {
  search: string;
  priority: Priority | "All";
  research: ResearchStatus | "All";
  applied: AppliedFilter;
  sector: string;
}

export const defaultFilters: Filters = {
  search: "",
  priority: "All",
  research: "All",
  applied: "All",
  sector: "All",
};
