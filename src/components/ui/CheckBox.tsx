import { InputHTMLAttributes, useId, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const reactId = useId();
    const checkboxId = id ?? reactId;

    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <div className="flex items-center h-5">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            className="w-4 h-4 border border-gray-300 rounded bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 dark:focus:ring-offset-gray-900 dark:bg-gray-800 dark:border-gray-600 transition-colors cursor-pointer"
            {...props}
          />
        </div>
        <label
          htmlFor={checkboxId}
          className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";