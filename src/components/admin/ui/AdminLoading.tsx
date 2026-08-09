import { cn } from "./cn";

type Props = {
  label?: string;
  className?: string;
};

export function AdminLoading({ label = "加载中…", className }: Props) {
  return (
    <div className={cn("flex items-center gap-3 text-sm text-[var(--admin-subtle)]", className)}>
      <span className="inline-block h-4 w-4 animate-spin rounded-full border border-[var(--admin-border)] border-t-white/70" />
      {label}
    </div>
  );
}
