import type { AnalyticsData, TrendPoint, User } from "@/types";
import { MODELS, MODEL_LABELS } from "./models";

function buildTrend(days: number): TrendPoint[] {
  const anchor = Date.parse("2026-08-27T00:00:00Z");
  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const t = (days - i) / days;
    const wave = Math.sin(i / 3.2);
    points.push({
      date: new Date(anchor - i * 86_400_000).toISOString().slice(0, 10),
      positive: Math.round(820 + t * 460 + wave * 55),
      neutral: Math.round(610 + t * 90 + wave * 38),
      negative: Math.round(520 - t * 60 + wave * 44),
    });
  }
  return points;
}

export const TREND_7D = buildTrend(7);
export const TREND_30D = buildTrend(30);
export const TREND_90D = buildTrend(90);

export const ANALYTICS: AnalyticsData = {
  totalPredictions: 87452,
  distribution: [
    { sentiment: "positive", count: 37430, share: 0.428 },
    { sentiment: "neutral", count: 27635, share: 0.316 },
    { sentiment: "negative", count: 22387, share: 0.256 },
  ],
  trend: TREND_30D,
  modelMetrics: MODELS.map((m) => ({
    model: m.id,
    label: MODEL_LABELS[m.id],
    type: m.type,
    metrics: m.metrics,
  })),
  confusionMatrix: {
    labels: ["positive", "neutral", "negative"],
    matrix: [
      [3963, 101, 116],
      [122, 2522, 216],
      [128, 157, 3675],
    ],
    model: "roberta",
  },
  perClass: MODELS.find((m) => m.id === "roberta")?.perClass ?? [],
  bestModelAccuracy: 0.924,
};

export const USERS: User[] = [
  {
    id: "usr_01",
    name: "Prajwal Deshmukh",
    email: "prajwal.deshmukh@sentimentlab.io",
    role: "administrator",
    status: "active",
    lastActive: "2026-08-27T17:42:00Z",
    predictions: 4820,
  },
  {
    id: "usr_02",
    name: "Ananya Krishnan",
    email: "ananya.krishnan@sentimentlab.io",
    role: "analyst",
    status: "active",
    lastActive: "2026-08-27T16:05:00Z",
    predictions: 12904,
  },
  {
    id: "usr_03",
    name: "Marcus Ellery",
    email: "marcus.ellery@sentimentlab.io",
    role: "analyst",
    status: "active",
    lastActive: "2026-08-27T09:18:00Z",
    predictions: 8641,
  },
  {
    id: "usr_04",
    name: "Sofia Marchetti",
    email: "sofia.marchetti@sentimentlab.io",
    role: "analyst",
    status: "invited",
    lastActive: "2026-08-25T12:30:00Z",
    predictions: 0,
  },
  {
    id: "usr_05",
    name: "Hiroshi Tanabe",
    email: "hiroshi.tanabe@sentimentlab.io",
    role: "administrator",
    status: "active",
    lastActive: "2026-08-26T20:11:00Z",
    predictions: 2310,
  },
  {
    id: "usr_06",
    name: "Grace Okonkwo",
    email: "grace.okonkwo@sentimentlab.io",
    role: "analyst",
    status: "suspended",
    lastActive: "2026-07-30T08:00:00Z",
    predictions: 5127,
  },
];
