
import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input className={cn("w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2", className)} {...props} />
  );
};
