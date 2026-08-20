import { SelectHTMLAttributes, forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

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
  ({ label, error, options, className = "", id, disabled, ...props }, ref) => {
    const reactId = useId();
    const selectId = id ?? reactId;

    return (
      <div className="flex flex-col w-full gap-1 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className={`text-sm font-medium ${
              disabled ? "text-muted opacity-50" : "text-foreground"
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none rounded border px-3 py-2 pr-10 text-sm bg-card text-foreground outline-none transition-colors duration-200 
              focus:ring-2 focus:border-transparent focus:ring-primary
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-error focus:ring-error" : "border-border"} 
              ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-card text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
        {error && <span className="text-xs text-error mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";