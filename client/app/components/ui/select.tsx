import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ className, children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false); // ✅ Track dropdown state

  return (
    <div className={cn("relative", className)} {...props}>
      {/* ✅ Toggle dropdown when clicking SelectTrigger */}
      <SelectTrigger onClick={() => setIsOpen((prev) => !prev)}>
        <SelectValue placeholder="Select an option" value={value} />
      </SelectTrigger>

      {isOpen && (
        <SelectContent>
          {/* ✅ Map over children and pass down click handler */}
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                  onSelect: (value: string) => {
                    onValueChange?.(value);
                    setIsOpen(false); // ✅ Close dropdown on selection
                  },
                })
              : child
          )}
        </SelectContent>
      )}
    </div>
  );
};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children, ...props }) => {
  return (
    <button className={cn("w-full px-3 py-2 border rounded-md bg-white text-left", className)} {...props}>
      {children}
    </button>
  );
};

interface SelectValueProps {
  placeholder?: string;
  value?: string;
}
export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>;
};

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SelectContent: React.FC<SelectContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("absolute mt-1 w-full border rounded-md bg-white shadow-md", className)} {...props}>
      {children}
    </div>
  );
};
interface SelectItemProps {
  value: string;
  onSelect?: (value: string) => void; // ✅ Custom prop for handling selection
  className?: string;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps & React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  value,
  children,
  onSelect,
  ...props
}) => {
  return (
    <div
      role="option"
      data-value={value}
      className={cn("px-3 py-2 cursor-pointer hover:bg-gray-100", className)}
      onClick={() => onSelect?.(value)} // ✅ Handle selection correctly
      {...props}
    >
      {children} {/* ✅ Render text inside the dropdown */}
    </div>
  );
};
