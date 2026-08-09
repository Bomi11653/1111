import { cn } from "./cn";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function AdminTabs({ tabs, active, onChange, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-1 border-b border-[var(--admin-border)]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm transition-colors duration-200 border-b-2 -mb-px",
            active === tab.id
              ? "border-white text-[var(--admin-text)]"
              : "border-transparent text-[var(--admin-subtle)] hover:text-[var(--admin-muted)]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
