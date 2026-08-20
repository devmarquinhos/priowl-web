interface ProgressBarProps {
  readonly progress: number;
  readonly label?: string;
  readonly showPercentage?: boolean;
}

export function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true, 
}: Readonly<ProgressBarProps>) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full flex flex-col gap-1">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {label && <span>{label}</span>}
          {showPercentage && <span>{safeProgress}%</span>}
        </div>
      )}
      
      <progress
        value={safeProgress}
        max={100}
        aria-label={label ?? "Progresso"}
        className="w-full h-2 appearance-none rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700
          [&::-webkit-progress-bar]:bg-gray-200 dark:[&::-webkit-progress-bar]:bg-gray-700 
          [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
      />
    </div>
  );
}