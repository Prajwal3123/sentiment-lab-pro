import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltipFrame, ChartTooltipRow } from "./common";

export interface MetricSeries {
  key: string;
  label: string;
  color: string;
}

/**
 * Grouped metric comparison bars — used for model benchmarking (models ×
 * Accuracy/Precision/Recall/F1) and per-class breakdowns (class × P/R/F1).
 * Values are 0–1 ratios and render as percentages.
 */
export function MetricGroupedBarChart({
  data,
  series,
  categoryKey,
  className,
  height = 300,
}: {
  data: Record<string, string | number>[];
  series: MetricSeries[];
  categoryKey: string;
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -8 }} barGap={2}>
          <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={categoryKey}
            axisLine={{ stroke: AXIS_PROPS.stroke }}
            tick={AXIS_PROPS.tick}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            tick={AXIS_PROPS.tick}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-high)", fillOpacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <ChartTooltipFrame title={String(label)}>
                  {payload.map((entry) => (
                    <ChartTooltipRow
                      key={String(entry.dataKey)}
                      label={String(entry.name)}
                      value={`${((Number(entry.value) ?? 0) * 100).toFixed(1)}%`}
                      color={String(entry.color)}
                    />
                  ))}
                </ChartTooltipFrame>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
              fillOpacity={i === 0 ? 1 : 0.85}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const METRIC_SERIES: MetricSeries[] = [
  { key: "accuracy", label: "Accuracy", color: CHART_COLORS.primary },
  { key: "precision", label: "Precision", color: CHART_COLORS.secondary },
  { key: "recall", label: "Recall", color: CHART_COLORS.tertiary },
  { key: "f1", label: "F1-score", color: CHART_COLORS.neutral },
];

export const CLASS_METRIC_SERIES: MetricSeries[] = [
  { key: "precision", label: "Precision", color: CHART_COLORS.primary },
  { key: "recall", label: "Recall", color: CHART_COLORS.secondary },
  { key: "f1", label: "F1-score", color: CHART_COLORS.neutral },
];
