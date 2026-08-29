import { cn } from "@/lib/utils";
import { MODEL_SHORT_LABELS, MODEL_TYPES } from "@/data/models";
import type { ModelName, ModelStatus, Sentiment } from "@/types";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  CircleDashed,
  Loader2,
  Minus,
  Sigma,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { ReactNode } from "react";

const SENTIMENT_STYLES: Record<
  Sentiment,
  { label: string; text: string; ring: string; bg: string; Icon: typeof ThumbsUp }
> = {
  positive: {
    label: "Positive",
    text: "text-positive",
    ring: "border-positive/40",
    bg: "bg-positive/10",
    Icon: ThumbsUp,
  },
  negative: {
    label: "Negative",
    text: "text-negative",
    ring: "border-negative/40",
    bg: "bg-negative/10",
    Icon: ThumbsDown,
  },
  neutral: {
    label: "Neutral",
    text: "text-neutral",
    ring: "border-neutral/40",
    bg: "bg-neutral/10",
    Icon: Minus,
  },
};

/** Sentiment is always icon + label + colour — never colour alone. */
export function SentimentBadge({
  sentiment,
  size = "sm",
  className,
}: {
  sentiment: Sentiment;
  size?: "sm" | "md";
  className?: string;
}) {
  const s = SENTIMENT_STYLES[sentiment];
  const Icon = s.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono uppercase",
        s.text,
        s.ring,
        s.bg,
        size === "sm" ? "px-2 py-0.5 text-label-sm" : "px-3 py-1 text-label-md",
        className,
      )}
    >
      <Icon aria-hidden className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={2} />
      {s.label}
    </span>
  );
}

export function sentimentColorVar(sentiment: Sentiment): string {
  return `var(--${sentiment})`;
}

export function ModelBadge({ model, className }: { model: ModelName; className?: string }) {
  const isTransformer = MODEL_TYPES[model] === "transformer";
  const Icon = isTransformer ? Brain : Sigma;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-label-sm",
        isTransformer
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-secondary/40 bg-secondary/10 text-secondary",
        className,
      )}
    >
      <Icon aria-hidden className="size-3" strokeWidth={2} />
      {MODEL_SHORT_LABELS[model]}
    </span>
  );
}

export function ModelTypeBadge({ model, className }: { model: ModelName; className?: string }) {
  const isTransformer = MODEL_TYPES[model] === "transformer";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-label-sm uppercase tracking-wide",
        isTransformer
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-outline-variant bg-surface-high text-on-surface-variant",
        className,
      )}
    >
      {isTransformer ? "Transformer" : "Traditional ML"}
    </span>
  );
}

const STATUS_STYLES: Record<
  string,
  { text: string; bg: string; border: string; Icon: typeof CheckCircle2 }
> = {
  ready: { text: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/40", Icon: CheckCircle2 },
  active: { text: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/40", Icon: CheckCircle2 },
  completed: { text: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/40", Icon: CheckCircle2 },
  training: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/40", Icon: Loader2 },
  running: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/40", Icon: Loader2 },
  processing: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/40", Icon: Loader2 },
  queued: { text: "text-on-surface-variant", bg: "bg-surface-high", border: "border-outline-variant", Icon: CircleDashed },
  uploaded: { text: "text-on-surface-variant", bg: "bg-surface-high", border: "border-outline-variant", Icon: CircleDashed },
  invited: { text: "text-on-surface-variant", bg: "bg-surface-high", border: "border-outline-variant", Icon: CircleDashed },
  draft: { text: "text-on-surface-variant", bg: "bg-surface-high", border: "border-outline-variant", Icon: CircleDashed },
  idle: { text: "text-on-surface-variant", bg: "bg-surface-high", border: "border-outline-variant", Icon: CircleDashed },
  failed: { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/40", Icon: AlertTriangle },
  suspended: { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/40", Icon: AlertTriangle },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: ModelStatus | string;
  label?: ReactNode;
  className?: string;
}) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["idle"]!;
  const Icon = s.Icon;
  const spinning = status === "training" || status === "running" || status === "processing";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-label-sm uppercase",
        s.text,
        s.bg,
        s.border,
        className,
      )}
    >
      <Icon aria-hidden className={cn("size-3", spinning && "animate-spin")} strokeWidth={2} />
      {label ?? status}
    </span>
  );
}
