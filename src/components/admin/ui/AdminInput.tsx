import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

export const adminInputStyles =
  "w-full rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-panel-soft)] px-3 py-2.5 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-subtle)] outline-none transition-colors duration-200 focus:border-[var(--admin-border-strong)] focus:ring-1 focus:ring-white/15";

export const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(adminInputStyles, className)} {...props} />
  ),
);
AdminInput.displayName = "AdminInput";
