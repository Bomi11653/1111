import type { ReactNode } from "react";
import { cn } from "./cn";

type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  className?: string;
};

export function AdminTable<T>({ columns, data, rowKey, empty, className }: Props<T>) {
  if (data.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-panel)]",
        className,
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-white/[0.02]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium tracking-wide text-[var(--admin-subtle)] uppercase",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-t border-[var(--admin-border)] transition-colors duration-150 hover:bg-white/[0.03]"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3.5 align-middle", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
