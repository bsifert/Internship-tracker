export type Size = "Small" | "Mid" | "Large" | "Program" | "";

export type ResearchStatus = "LIVE" | "IMMINENT" | "WATCH" | "UNRESEARCHED";

export type Priority = "High" | "Medium" | "Low";

export type ApplicationStatus =
  | "Not Started"
  | "In Progress"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export type CoverLetterStatus = "None" | "Drafted" | "Complete" | "Submitted";

/** One entry in a company's status timeline, appended whenever status changes. */
export interface StatusEvent {
  at: string;
  from: ApplicationStatus | null;
  to: ApplicationStatus;
}

export interface Internship {
  id: string;
  company: string;
  sector: string;
  size: Size;
  nearestOffice: string;
  /** Link to the job posting or the company's careers page. */
  url: string;
  researchStatus: ResearchStatus;
  priority: Priority;
  citizenship: string;
  applied: boolean;
  status: ApplicationStatus;
  deadline: string;
  /** Date you next want to chase this one up. */
  followUpDate: string;
  contact: string;
  coverLetter: CoverLetterStatus;
  myNotes: string;
  researchNotes: string;
  lastResearched: string;
  history: StatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export const RESEARCH_STATUSES: ResearchStatus[] = [
  "LIVE",
  "IMMINENT",
  "WATCH",
  "UNRESEARCHED",
];

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Not Started",
  "In Progress",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export const COVER_LETTER_STATUSES: CoverLetterStatus[] = [
  "None",
  "Drafted",
  "Complete",
  "Submitted",
];

export const SIZES: Size[] = ["Small", "Mid", "Large", "Program"];

export type NewInternship = Omit<
  Internship,
  "id" | "createdAt" | "updatedAt" | "history"
>;

export const emptyInternship: NewInternship = {
  company: "",
  sector: "",
  size: "",
  nearestOffice: "",
  url: "",
  researchStatus: "UNRESEARCHED",
  priority: "Medium",
  citizenship: "",
  applied: false,
  status: "Not Started",
  deadline: "",
  followUpDate: "",
  contact: "",
  coverLetter: "None",
  myNotes: "",
  researchNotes: "",
  lastResearched: "",
};

/**
 * The sheet this app was seeded from was exported as a PDF, which clipped long
 * research notes mid-sentence. Those rows are worth rewriting, so flag them.
 */
export function isNoteTruncated(item: Internship): boolean {
  const notes = item.researchNotes.trimEnd();
  return notes.endsWith("…") || notes.endsWith("...");
}
