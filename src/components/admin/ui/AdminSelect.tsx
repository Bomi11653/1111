import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";
import { adminInputStyles } from "./AdminInput";

export const AdminSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(adminInputStyles, "cursor-pointer", className)} {...props}>
      {children}
    </select>
  ),
);
AdminSelect.displayName = "AdminSelect";
