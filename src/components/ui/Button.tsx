import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4";

    const variants = {
      primary:
        "text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 shadow-sm",
      secondary:
        "text-secondary-900 bg-secondary-100 hover:bg-secondary-200 active:bg-secondary-300 focus:ring-secondary-300 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-100 dark:focus:ring-secondary-600 shadow-sm",
      danger:
        "text-white bg-danger-600 hover:bg-danger-700 active:bg-danger-800 focus:ring-danger-300 dark:bg-danger-600 dark:hover:bg-danger-700 dark:focus:ring-danger-800 shadow-sm",
      success:
        "text-white bg-success-600 hover:bg-success-700 active:bg-success-800 focus:ring-success-300 dark:bg-success-600 dark:hover:bg-success-700 dark:focus:ring-success-800 shadow-sm",
      warning:
        "text-white bg-warning-600 hover:bg-warning-700 active:bg-warning-800 focus:ring-warning-300 dark:bg-warning-600 dark:hover:bg-warning-700 dark:focus:ring-warning-800 shadow-sm",
      ghost: 
        "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300 dark:focus:ring-gray-700",
    };

    const sizes = {
      xs: "px-2.5 py-1.5 text-xs",
      sm: "px-3 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-wait",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
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
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
