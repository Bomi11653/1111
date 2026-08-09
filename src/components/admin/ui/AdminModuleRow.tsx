import { GripVertical } from "lucide-react";
import { AdminButton } from "./AdminButton";
import { AdminSwitch } from "./AdminSwitch";
import { cn } from "./cn";

type Props = {
  title: string;
  description: string;
  enabled: boolean;
  order: number;
  onEnabledChange: (v: boolean) => void;
  onOrderChange: (v: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit?: () => void;
  className?: string;
};

export function AdminModuleRow({
  title,
  description,
  enabled,
  order,
  onEnabledChange,
  onOrderChange,
  onMoveUp,
  onMoveDown,
  onEdit,
  className,
}: Props) {
  return (
    <div className={cn("admin-module-row", className)}>
      <div className="draggable text-[var(--admin-subtle)]" data-draggable="true">
        <GripVertical className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <AdminSwitch checked={enabled} onChange={onEnabledChange} />
      <div className="min-w-0">
        <p className="text-sm text-[var(--admin-text)]">{title}</p>
        <p className="text-xs text-[var(--admin-subtle)] mt-0.5 truncate">{description}</p>
      </div>
      <input
        type="number"
        value={order}
        onChange={(e) => onOrderChange(Number(e.target.value) || 0)}
        className="w-14 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-panel-soft)] px-2 py-1 text-xs text-[var(--admin-text)] text-center"
      />
      <div className="flex gap-1">
        {onMoveUp ? (
          <AdminButton variant="ghost" size="sm" onClick={onMoveUp}>
            ↑
          </AdminButton>
        ) : null}
        {onMoveDown ? (
          <AdminButton variant="ghost" size="sm" onClick={onMoveDown}>
            ↓
          </AdminButton>
        ) : null}
        {onEdit ? (
          <AdminButton variant="outline" size="sm" onClick={onEdit}>
            编辑
          </AdminButton>
        ) : null}
      </div>
    </div>
  );
}
