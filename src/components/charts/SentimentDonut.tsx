import { cn } from "@/lib/utils";
import { compactNumber } from "@/lib/format";
import type { Sentiment } from "@/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltipFrame, ChartTooltipRow, SENTIMENT_CHART_COLOR } from "./common";

export interface SentimentSlice {
  sentiment: Sentiment;
  count: number;
  share?: number;
}

const LABELS: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

/** Donut used for sentiment distribution panels. Center shows the total volume. */
export function SentimentDonut({
  data,
  className,
  height = 260,
}: {
  data: SentimentSlice[];
  className?: string;
  height?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="sentiment"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.sentiment} fill={SENTIMENT_CHART_COLOR[entry.sentiment]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const first = payload[0];
              if (!first) return null;
              const slice = first.payload as SentimentSlice;
              const share = slice.share ?? slice.count / total;
              return (
                <ChartTooltipFrame title={LABELS[slice.sentiment]}>
                  <ChartTooltipRow
                    label="Predictions"
                    value={compactNumber(slice.count)}
                    color={SENTIMENT_CHART_COLOR[slice.sentiment]}
                  />
                  <ChartTooltipRow label="Share" value={`${(share * 100).toFixed(1)}%`} />
                </ChartTooltipFrame>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
          Total
        </span>
        <span className="text-headline-md font-semibold tabular-nums text-on-surface">
          {compactNumber(total)}
        </span>
      </div>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d) => (
          <li key={d.sentiment} className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface-variant">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: SENTIMENT_CHART_COLOR[d.sentiment] }}
            />
            {LABELS[d.sentiment]}
            <span className="tabular-nums text-on-surface">{compactNumber(d.count)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
