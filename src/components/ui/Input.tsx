import { InputHTMLAttributes, forwardRef, ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly error?: string;
  readonly icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    // Hook do React que gera um ID único e seguro para SSR/Client
    const reactId = useId();
    const inputId = id ?? reactId;

    return (
      <div className="flex flex-col w-full gap-1 text-left">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full border rounded px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors duration-200 
              dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-500
              focus:ring-2 focus:border-transparent focus:ring-primary
              ${error ? "border-error focus:ring-error" : "border-gray-300"} 
              ${className}`}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-error mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";