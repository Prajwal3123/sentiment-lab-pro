import { PREDICTIONS } from "@/data/predictions";
import type { HistoryFilters, Prediction } from "@/types";
import { delay } from "./api-contract";

/** GET /api/predictions */
export async function getPredictionHistory(filters?: HistoryFilters): Promise<Prediction[]> {
  let rows = [...PREDICTIONS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter((p) => p.text.toLowerCase().includes(q));
  }
  if (filters?.model && filters.model !== "all") {
    rows = rows.filter((p) => p.model === filters.model);
  }
  if (filters?.sentiment && filters.sentiment !== "all") {
    rows = rows.filter((p) => p.sentiment === filters.sentiment);
  }
  if (typeof filters?.minConfidence === "number") {
    rows = rows.filter((p) => p.confidence >= filters.minConfidence!);
  }

  rows.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return delay(rows, 300);
}

/** GET /api/predictions/:id */
export async function getPrediction(id: string): Promise<Prediction | undefined> {
  return delay(
    PREDICTIONS.find((p) => p.id === id),
    200,
  );
}

export async function getRecentPredictions(limit = 6): Promise<Prediction[]> {
  return delay(
    [...PREDICTIONS]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, limit),
    260,
  );
}
