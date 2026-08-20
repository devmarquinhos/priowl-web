import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  readonly fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", fullWidth = false, className = "", type = "button", ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium rounded px-5 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
    
    const variants = {
      primary: "bg-primary text-white hover:opacity-90 focus:ring-primary shadow-sm",
      
      secondary: "bg-muted text-foreground hover:opacity-80 focus:ring-border",
      
      danger: "bg-error text-white hover:opacity-90 focus:ring-error shadow-sm",
      
      outline: "border border-border bg-transparent text-foreground hover:bg-muted focus:ring-border",
      
      ghost: "bg-transparent text-foreground hover:bg-muted focus:ring-border",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";