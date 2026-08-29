import { cn } from "@/lib/utils";
import { percent } from "@/lib/format";
import type { ClassProbabilities, Sentiment } from "@/types";

const BAR_COLOR: Record<Sentiment, string> = {
  positive: "bg-positive",
  negative: "bg-negative",
  neutral: "bg-neutral",
};

const TEXT_COLOR: Record<Sentiment, string> = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-neutral",
};

export function ConfidenceMeter({
  sentiment,
  value,
  label = "Confidence",
  className,
}: {
  sentiment: Sentiment;
  value: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-label-sm uppercase tracking-[0.1em] text-on-surface-variant">
          {label}
        </span>
        <span className={cn("font-mono text-label-md tabular-nums", TEXT_COLOR[sentiment])}>
          {percent(value)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} ${percent(value)}`}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-high"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", BAR_COLOR[sentiment])}
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </div>
    </div>
  );
}

const ORDER: Sentiment[] = ["positive", "neutral", "negative"];

export function ClassProbabilityBars({
  probabilities,
  className,
}: {
  probabilities: ClassProbabilities;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {ORDER.map((s) => (
        <div key={s} className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className={cn("font-mono text-label-md capitalize", TEXT_COLOR[s])}>{s}</span>
            <span className="font-mono text-label-md tabular-nums text-on-surface">
              {percent(probabilities[s])}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-high">
            <div
              className={cn("h-full rounded-full transition-[width] duration-500", BAR_COLOR[s])}
              style={{ width: `${probabilities[s] * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
