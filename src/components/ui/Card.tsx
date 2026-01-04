import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = "default", 
    padding = "md",
    hover = false,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = "bg-white dark:bg-gray-800 rounded-2xl transition-all duration-200";
    
    const variants = {
      default: "shadow-md dark:border dark:border-gray-700",
      elevated: "shadow-2xl rounded-3xl dark:border dark:border-gray-700",
      outlined: "border-2 border-gray-200 dark:border-gray-700 shadow-sm",
      glass: "glass shadow-soft",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover 
      ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" 
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
