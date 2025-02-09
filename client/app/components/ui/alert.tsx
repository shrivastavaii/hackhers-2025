
import React from "react";
import { cn } from "@/lib/utils";

// components/ui/alert.tsx
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive";
  }
  
  export const Alert: React.FC<AlertProps> = ({ className, variant = "default", children, ...props }) => {
    const variantClasses = {
      default: "bg-green-100 text-green-800",
      destructive: "bg-red-100 text-red-800 border border-red-500",
    };
  
    return (
      <div className={cn("p-4 rounded-md", variantClasses[variant], className)} {...props}>
        {children}
      </div>
    );
  };
  
  export const AlertDescription: React.FC<AlertProps> = ({ className, children, ...props }) => {
    return <p className={cn("text-sm text-gray-700", className)} {...props}>{children}</p>;
  };