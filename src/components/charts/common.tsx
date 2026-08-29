import { cn } from "@/lib/utils";

/**
 * Shared dark-theme tooltip shell for every Recharts visual.
 * Charts pass their own row renderer so tooltips stay consistent.
 */
export function ChartTooltipFrame({
  title,
  className,
  children,
}: {
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-w-40 rounded-lg border border-outline-variant bg-popover px-3 py-2 shadow-lg lab-glow",
        className,
      )}
    >
      {title ? (
        <p className="mb-1.5 font-mono text-label-sm font-medium text-on-surface">{title}</p>
      ) : null}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function ChartTooltipRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface-variant">
        {color ? (
          <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: color }} />
        ) : null}
        {label}
      </span>
      <span className="font-mono text-label-sm tabular-nums text-on-surface">{value}</span>
    </div>
  );
}

export const CHART_COLORS = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  negative: "var(--chart-3)",
  neutral: "var(--chart-4)",
  tertiary: "var(--chart-5)",
} as const;

export const SENTIMENT_CHART_COLOR = {
  positive: "var(--positive)",
  neutral: "var(--neutral)",
  negative: "var(--negative)",
} as const;

export const AXIS_PROPS = {
  tick: { fill: "var(--on-surface-variant)", fontSize: 10, fontFamily: "JetBrains Mono" },
  stroke: "var(--outline-variant)",
  tickLine: false,
} as const;
