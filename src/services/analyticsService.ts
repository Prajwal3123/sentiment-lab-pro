import { ANALYTICS, TREND_7D, TREND_30D, TREND_90D, USERS } from "@/data/analytics";
import { DATASETS } from "@/data/datasets";
import { MODELS } from "@/data/models";
import { PREDICTIONS } from "@/data/predictions";
import type { AnalyticsData, AnalyticsFilters, User } from "@/types";
import { delay } from "./api-contract";

/** GET /api/analytics */
export async function getAnalytics(filters?: AnalyticsFilters): Promise<AnalyticsData> {
  const trend =
    filters?.range === "7d" ? TREND_7D : filters?.range === "90d" ? TREND_90D : TREND_30D;

  const modelMetrics =
    filters?.model && filters.model !== "all"
      ? ANALYTICS.modelMetrics.filter((m) => m.model === filters.model)
      : ANALYTICS.modelMetrics;

  const scale = filters?.range === "7d" ? 0.24 : filters?.range === "90d" ? 2.8 : 1;

  return delay(
    {
      ...ANALYTICS,
      trend,
      modelMetrics,
      totalPredictions: Math.round(ANALYTICS.totalPredictions * scale),
      distribution: ANALYTICS.distribution.map((d) => ({
        ...d,
        count: Math.round(d.count * scale),
      })),
    },
    380,
  );
}

export async function getAdminSummary() {
  return delay(
    {
      totalUsers: USERS.length,
      activeAnalysts: USERS.filter((u) => u.role === "analyst" && u.status === "active").length,
      datasets: DATASETS.length,
      trainedModels: MODELS.filter((m) => m.status === "ready").length,
      predictions: ANALYTICS.totalPredictions,
      recentPredictions: PREDICTIONS.slice(0, 5),
    },
    280,
  );
}

export async function getUsers(): Promise<User[]> {
  return delay(USERS, 260);
}
