import { Task, AnalyzedTask, UrgencyLevel } from "@/types/task";

export function analyzeTaskDeadlines(tasks: readonly Task[]): AnalyzedTask[] {
  const now = new Date().getTime();

  return tasks
    .map((task) => {
      const due = new Date(task.dueDate).getTime();
      const diffHours = (due - now) / (1000 * 60 * 60);

      let urgency: UrgencyLevel = "normal";
      let timeLeftText = "No prazo";
      let badgeClass = "bg-gray-100 text-gray-700 border-gray-200";
      let borderClass = "border-l-gray-300";

      if (diffHours < 0) {
        urgency = "overdue";
        timeLeftText = "Atrasado";
        badgeClass = "bg-red-100 text-red-700 border-red-200";
        borderClass = "border-l-red-500";
      } else if (diffHours <= 3) {
        urgency = "critical";
        timeLeftText = `Em ${Math.ceil(diffHours)}h`;
        badgeClass = "bg-orange-100 text-orange-800 border-orange-200";
        borderClass = "border-l-orange-500";
      } else if (diffHours <= 24) {
        urgency = "warning";
        timeLeftText = `Em ${Math.ceil(diffHours)}h`;
        badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
        borderClass = "border-l-amber-500";
      } else {
        const days = Math.ceil(diffHours / 24);
        timeLeftText = `Em ${days}d`;
      }

      return { ...task, urgency, timeLeftText, badgeClass, borderClass };
    })
    .filter((task) => task.urgency !== "normal")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}