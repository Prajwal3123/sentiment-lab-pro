import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Standard research panel: surface-container, 1px outline, 12px radius. */
export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("lab-card", className)} {...rest}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant px-4 py-3 sm:px-6 sm:py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-body-md text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-4 sm:p-6", className)}>{children}</div>;
}

/** Monospaced technical label used for metrics, IDs, and column headers. */
export function Mono({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn("font-mono text-label-md", className)}>{children}</span>;
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-label-sm uppercase tracking-[0.12em] text-on-surface-variant",
        className,
      )}
    >
      {children}
    </p>
  );
}
