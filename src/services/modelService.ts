import { MODELS } from "@/data/models";
import type { ModelName, ModelType, SentimentModel } from "@/types";
import { delay } from "./api-contract";

/** GET /api/models */
export async function getModels(filter?: { type?: ModelType | "all" }): Promise<SentimentModel[]> {
  const list =
    !filter?.type || filter.type === "all"
      ? MODELS
      : MODELS.filter((m) => m.type === filter.type);
  return delay(list, 260);
}

/** GET /api/models/:id */
export async function getModel(id: ModelName | string): Promise<SentimentModel | undefined> {
  return delay(
    MODELS.find((m) => m.id === id),
    240,
  );
}

/** GET /api/comparison */
export async function getModelComparison(options?: {
  datasetId?: string;
  type?: ModelType | "all";
}): Promise<SentimentModel[]> {
  const list =
    !options?.type || options.type === "all"
      ? MODELS
      : MODELS.filter((m) => m.type === options.type);
  return delay([...list].sort((a, b) => b.metrics.accuracy - a.metrics.accuracy), 320);
}
