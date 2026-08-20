import { InputHTMLAttributes, useId, forwardRef } from "react";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  readonly label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, checked, onChange, className = "", id, disabled, ...props }, ref) => {
    const reactId = useId();
    const toggleId = id ?? reactId;

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <label 
          htmlFor={toggleId}
          className={`relative inline-flex items-center ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <input
            type="checkbox"
            id={toggleId}
            ref={ref}
            disabled={disabled}
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
            {...props}
          />
          <div className="h-6 w-11 rounded-full bg-border transition-colors duration-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer-focus:ring-offset-1 peer-focus:ring-offset-background peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-border after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
        {label && (
          <label 
            htmlFor={toggleId} 
            className={`select-none text-sm font-medium ${
              disabled ? "cursor-not-allowed opacity-50 text-muted" : "cursor-pointer text-foreground"
            }`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";