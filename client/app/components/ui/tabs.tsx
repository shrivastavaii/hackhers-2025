import React, { useContext, createContext, useState } from "react";
import { cn } from "@/lib/utils";

// ✅ Create Context to manage active tab state
const TabsContext = createContext<{ activeTab: string; setActiveTab: (value: string) => void } | null>(null);

export const Tabs: React.FC<{ defaultValue: string } & React.HTMLAttributes<HTMLDivElement>> = ({ defaultValue, className, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("flex flex-col", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return <div className={cn("flex border-b", className)} {...props}>{children}</div>;
};

// ✅ Update TabsTrigger to change the active tab
export const TabsTrigger: React.FC<{ value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs provider");

  const isActive = context.activeTab === value;

  return (
    <button
      className={cn("px-4 py-2 text-sm font-medium border-b-2", isActive ? "border-blue-500" : "border-transparent", className)}
      onClick={() => context.setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ Update TabsContent to show the active content
export const TabsContent: React.FC<{ value: string } & React.HTMLAttributes<HTMLDivElement>> = ({ className, value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within a Tabs provider");

  return (
    <div className={cn("p-4", context.activeTab === value ? "block" : "hidden", className)} {...props}>
      {children}
    </div>
  );
};
