import { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly label?: string;
  readonly error?: string;
  readonly options: readonly SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const reactId = useId();
    const selectId = id ?? reactId;

    return (
      <div className="flex flex-col w-full gap-1 text-left">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full border rounded px-3 py-2 text-sm bg-white text-gray-900 outline-none transition-colors duration-200 
            dark:bg-gray-900 dark:text-white dark:border-gray-700
            focus:ring-2 focus:border-transparent focus:ring-primary appearance-none
            ${error ? "border-error focus:ring-error" : "border-gray-300"} 
            ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-error mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";