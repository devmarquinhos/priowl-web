import { InputHTMLAttributes, useId } from "react";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label?: string;
}

export function Toggle({ label, checked, onChange, className = "", id, ...props }: Readonly<ToggleProps>) {
  const reactId = useId();
  const toggleId = id ?? reactId;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label 
        htmlFor={toggleId}
        className="relative inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
      {label && (
        <label htmlFor={toggleId} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}