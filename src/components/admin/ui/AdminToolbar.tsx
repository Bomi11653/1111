import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function AdminToolbar({ children, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 mb-6", className)}>{children}</div>
  );
}
