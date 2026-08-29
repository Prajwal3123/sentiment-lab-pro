import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { EmptyState, ErrorState, LoadingState } from "./states";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  cell: (row: T, index: number) => ReactNode;
  /** Hide below the given breakpoint to keep dense tables readable on mobile. */
  hideBelow?: "sm" | "md" | "lg";
}

const HIDE_CLASS = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  isLoading,
  error,
  emptyTitle = "No records match these filters",
  emptyDescription,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState description={error} />;
  if (!rows.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className={cn("lab-scroll w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-outline-variant">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-4 py-2.5 font-mono text-label-sm font-medium uppercase tracking-[0.08em] text-on-surface-variant",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.hideBelow && HIDE_CLASS[col.hideBelow],
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const interactive = Boolean(onRowClick);
            return (
              <tr
                key={rowKey(row, index)}
                {...(interactive
                  ? {
                      tabIndex: 0,
                      role: "button",
                      onClick: () => onRowClick?.(row),
                      onKeyDown: (event: React.KeyboardEvent) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowClick?.(row);
                        }
                      },
                    }
                  : {})}
                className={cn(
                  "border-b border-outline-variant/60 transition-colors last:border-0",
                  interactive && "cursor-pointer hover:bg-surface-high focus:bg-surface-high focus:outline-none",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 align-middle text-body-md text-on-surface",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.hideBelow && HIDE_CLASS[col.hideBelow],
                    )}
                  >
                    {col.cell(row, index)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
