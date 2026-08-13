import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary" | "danger" | "outline";
  readonly fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", fullWidth = false, className = "", type = "button", ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium rounded px-5 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    
    const variants = {
      primary: "bg-primary text-white hover:opacity-90 focus:ring-primary shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500",
      danger: "bg-error text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900 focus:ring-gray-500",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";