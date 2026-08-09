import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function AdminEmpty({ title = "暂无数据", description, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--admin-radius)] border border-dashed border-[var(--admin-border)] bg-[var(--admin-panel)] px-8 py-16 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-[var(--admin-muted)]">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-xs text-[var(--admin-subtle)] leading-relaxed">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
