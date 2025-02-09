
import React from "react";
import { cn } from "@/lib/utils";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "primary" | "secondary";
    size?: "default" | "sm" | "lg" | "icon"; // Define allowed sizes
  }
  
  export const Button: React.FC<ButtonProps> = ({ className, children, variant = "default", size = "default", ...props }) => {
    const variantClasses = {
      default: "bg-primary text-white hover:bg-primary-dark",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
    };
  
    const sizeClasses = {
      default: "px-4 py-2",
      sm: "px-2 py-1 text-sm",
      lg: "px-6 py-3 text-lg",
      icon: "p-2 rounded-full", // For icon-only buttons
    };
  
    return (
      <button
        className={cn("rounded-md", variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  };
  