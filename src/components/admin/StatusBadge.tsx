type StatusType = "success" | "error" | "warning" | "neutral";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

export default function StatusBadge({ status, label }: Readonly<StatusBadgeProps>) {
  const styles = {
    success: "bg-green-100 text-green-700 border-green-200",
    error: "bg-red-100 text-red-700 border-red-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const dotColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    neutral: "bg-gray-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`}></span>
      {label}
    </span>
  );
}