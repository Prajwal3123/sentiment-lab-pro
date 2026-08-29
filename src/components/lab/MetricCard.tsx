import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  delta,
  hint,
  className,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: "default" | "positive" | "negative" | "neutral" | "primary";
  delta?: number;
  hint?: string;
  className?: string;
}) {
  const toneClass = {
    default: "text-on-surface",
    positive: "text-positive",
    negative: "text-negative",
    neutral: "text-neutral",
    primary: "text-primary",
  }[tone];

  return (
    <div
      className={cn(
        "lab-card flex flex-col gap-3 p-4 transition-colors hover:border-outline",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-label-sm uppercase tracking-[0.1em] text-on-surface-variant">
          {label}
        </p>
        {Icon ? <Icon aria-hidden className={cn("size-4 shrink-0", toneClass)} /> : null}
      </div>
      <p className={cn("text-headline-lg font-semibold tabular-nums", toneClass)}>{value}</p>
      {typeof delta === "number" || hint ? (
        <div className="flex items-center gap-2 font-mono text-label-sm text-on-surface-variant">
          {typeof delta === "number" ? (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                delta >= 0 ? "text-positive" : "text-negative",
              )}
            >
              {delta >= 0 ? (
                <TrendingUp aria-hidden className="size-3" />
              ) : (
                <TrendingDown aria-hidden className="size-3" />
              )}
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          ) : null}
          {hint ? <span className="truncate">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
