import { cn } from "@/lib/utils";
import { compactNumber, formatDate } from "@/lib/format";
import type { TrendPoint } from "@/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, ChartTooltipFrame, ChartTooltipRow, SENTIMENT_CHART_COLOR } from "./common";

const SERIES = [
  { key: "positive", label: "Positive" },
  { key: "neutral", label: "Neutral" },
  { key: "negative", label: "Negative" },
] as const;

/** Daily sentiment volumes over the selected window. */
export function SentimentTrendChart({
  data,
  className,
  height = 300,
}: {
  data: TrendPoint[];
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v: string) => formatDate(v)}
            tick={AXIS_PROPS.tick}
            tickLine={false}
            axisLine={{ stroke: AXIS_PROPS.stroke }}
            minTickGap={24}
          />
          <YAxis tick={AXIS_PROPS.tick} axisLine={false} tickLine={false} width={48} tickFormatter={(v: number) => compactNumber(v)} />
          <Tooltip
            cursor={{ stroke: "var(--outline)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <ChartTooltipFrame title={formatDate(String(label))}>
                  {payload.map((entry) => (
                    <ChartTooltipRow
                      key={String(entry.dataKey)}
                      label={String(entry.name)}
                      value={compactNumber(Number(entry.value) ?? 0)}
                      color={String(entry.stroke)}
                    />
                  ))}
                </ChartTooltipFrame>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", paddingTop: 8 }}
            iconType="plainline"
            iconSize={14}
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={SENTIMENT_CHART_COLOR[s.key]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
