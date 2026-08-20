import { InputHTMLAttributes, useId, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  readonly label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, disabled, ...props }, ref) => {
    const reactId = useId();
    const checkboxId = id ?? reactId;

    return (
      <div className={`flex items-start gap-2.5 ${className}`}>
        <div className="flex items-center h-5">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            disabled={disabled}
            className="h-4 w-4 rounded border border-border bg-card text-primary accent-primary transition-colors cursor-pointer focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
        </div>
        <label
          htmlFor={checkboxId}
          className={`select-none text-sm text-foreground cursor-pointer leading-none pt-0.5 ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";