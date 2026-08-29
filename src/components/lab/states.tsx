import { cn } from "@/lib/utils";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function LoadingState({
  label = "Loading research data…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-3 text-on-surface-variant",
        className,
      )}
    >
      <Loader2 aria-hidden className="size-5 animate-spin text-primary" />
      <span className="font-mono text-label-md">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-2 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-1 flex size-10 items-center justify-center rounded-full border border-outline-variant bg-surface-high text-on-surface-variant">
        {icon ?? <Inbox aria-hidden className="size-5" />}
      </div>
      <p className="text-body-lg font-semibold text-on-surface">{title}</p>
      {description ? (
        <p className="max-w-sm text-body-md text-on-surface-variant">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Could not load this view",
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-2 px-6 py-10 text-center",
        className,
      )}
    >
      <AlertTriangle aria-hidden className="size-6 text-destructive" />
      <p className="text-body-lg font-semibold text-on-surface">{title}</p>
      {description ? (
        <p className="max-w-sm text-body-md text-on-surface-variant">{description}</p>
      ) : null}
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}

/** Small inline notice marking simulated (non-model) output. */
export function MockNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border border-outline-variant bg-surface-low px-3 py-2 font-mono text-label-sm leading-[14px] text-on-surface-variant",
        className,
      )}
    >
      <AlertTriangle aria-hidden className="mt-px size-3 shrink-0 text-neutral" />
      <span className="normal-case">
        {children ??
          "Simulated output from the local mock service — no machine learning model is executed in this build."}
      </span>
    </p>
  );
}
