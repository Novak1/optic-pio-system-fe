import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "danger" | "warning";
}

export default function Spinner({
  size = "md",
  color = "primary",
  className,
  ...props
}: SpinnerProps) {
  const sizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colors = {
    primary: "text-primary-600 dark:text-primary-400",
    secondary: "text-secondary-600 dark:text-secondary-400",
    success: "text-success-600 dark:text-success-400",
    danger: "text-danger-600 dark:text-danger-400",
    warning: "text-warning-600 dark:text-warning-400",
  };

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <svg
        className={cn("animate-spin", sizes[size], colors[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
