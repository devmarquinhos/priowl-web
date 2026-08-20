export type UrgencyLevel = "overdue" | "critical" | "warning" | "normal";

export interface Task {
  id: string;
  title: string;
  dueDate: string | Date;
  status?: string;
}

export interface AnalyzedTask extends Task {
  urgency: UrgencyLevel;
  timeLeftText: string;
  badgeClass: string;
  borderClass: string;
}