import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminSectionHeader({ title, description, actions, className }: Props) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-5", className)}>
      <div>
        <h2 className="text-sm font-medium tracking-tight text-[var(--admin-text)]">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-[var(--admin-subtle)] leading-relaxed">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
