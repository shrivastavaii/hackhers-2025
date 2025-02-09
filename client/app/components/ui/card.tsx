// components/ui/card.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className, children, ...props }) => {
  return <div className={cn("space-y-1.5 p-4", className)} {...props}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ className, children, ...props }) => {
  return <h3 className={cn("text-lg font-semibold", className)} {...props}>{children}</h3>;
};

export const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => {
  return <div className={cn("p-4 pt-0", className)} {...props}>{children}</div>;
};

export const CardDescription: React.FC<CardProps> = ({ className, children, ...props }) => {
  return <p className={cn("text-sm text-gray-500", className)} {...props}>{children}</p>;
};
