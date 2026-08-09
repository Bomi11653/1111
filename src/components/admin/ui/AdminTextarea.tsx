import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "./cn";
import { adminInputStyles } from "./AdminInput";

export const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(adminInputStyles, "min-h-24 resize-y", className)} {...props} />
  ),
);
AdminTextarea.displayName = "AdminTextarea";
