interface StatusBadgeProps {
  readonly status: "success" | "warning" | "error" | "info" | "default";
  readonly label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[status]}`}>
      {status === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" aria-hidden="true"></span>}
      {label}
    </span>
  );
}