import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

export function AdminCard({ title, description, actions, children, className, padding = "md" }: Props) {
  const pad = padding === "sm" ? "p-4" : padding === "lg" ? "p-8" : "p-6";

  return (
    <section
      className={cn(
        "rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-panel)]",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
        "transition-colors duration-200 hover:border-[var(--admin-border-strong)]",
        className,
      )}
    >
      {(title || description || actions) && (
        <div
          className={cn(
            "flex items-start justify-between gap-4 border-b border-[var(--admin-border)]",
            pad,
            "pb-4",
          )}
        >
          <div>
            {title ? (
              <h2 className="text-sm font-medium tracking-tight text-[var(--admin-text)]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-xs text-[var(--admin-subtle)] leading-relaxed">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      <div className={cn(pad, title || description || actions ? "pt-5" : "")}>{children}</div>
    </section>
  );
}
