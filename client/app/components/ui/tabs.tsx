
import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Tabs: React.FC<TabsProps> = ({ className, children, ...props }) => {
  return <div className={cn("flex flex-col", className)} {...props}>{children}</div>;
};

export const TabsList: React.FC<TabsProps> = ({ className, children, ...props }) => {
  return <div className={cn("flex border-b", className)} {...props}>{children}</div>;
};

export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
  return (
    <button className={cn("px-4 py-2 text-sm font-medium border-b-2 focus:outline-none", className)} {...props}>
      {children}
    </button>
  );
};


interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
  }
  
  export const TabsContent: React.FC<TabsContentProps> = ({ className, value, children, ...props }) => {
    return (
      <div
        data-value={value}
        className={cn("p-4 hidden data-[active=true]:block", className)}
        {...props}
      >
        {children}
      </div>
    );
  };