import { cn } from "./cn";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
};

export function AdminSwitch({ checked, onChange, label, disabled, id }: Props) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200",
          checked
            ? "bg-white border-white/20"
            : "bg-[var(--admin-panel-soft)] border-[var(--admin-border)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full transition-transform duration-200",
            checked ? "translate-x-4 bg-black" : "translate-x-0 bg-[var(--admin-muted)]",
          )}
        />
      </button>
      {label ? <span className="text-sm text-[var(--admin-muted)]">{label}</span> : null}
    </label>
  );
}
