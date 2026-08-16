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

export interface Internship {
  id: string;
  company: string;
  sector: string;
  size: Size;
  nearestOffice: string;
  researchStatus: ResearchStatus;
  priority: Priority;
  citizenship: string;
  applied: boolean;
  status: ApplicationStatus;
  deadline: string;
  contact: string;
  coverLetter: CoverLetterStatus;
  myNotes: string;
  researchNotes: string;
  lastResearched: string;
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
  "id" | "createdAt" | "updatedAt"
>;

export const emptyInternship: NewInternship = {
  company: "",
  sector: "",
  size: "",
  nearestOffice: "",
  researchStatus: "UNRESEARCHED",
  priority: "Medium",
  citizenship: "",
  applied: false,
  status: "Not Started",
  deadline: "",
  contact: "",
  coverLetter: "None",
  myNotes: "",
  researchNotes: "",
  lastResearched: "",
};
