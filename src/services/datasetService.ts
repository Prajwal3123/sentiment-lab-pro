import { DATASETS } from "@/data/datasets";
import type { Dataset, DatasetStage } from "@/types";
import { delay } from "./api-contract";

/**
 * Datasets uploaded during the session live in this in-memory store only.
 * Nothing is transmitted anywhere — POST /api/datasets/upload replaces this.
 */
const sessionDatasets: Dataset[] = [];

export const STAGE_ORDER: DatasetStage[] = [
  "uploaded",
  "cleaned",
  "tokenized",
  "vectorized",
  "ready",
];

export const STAGE_LABELS: Record<DatasetStage, string> = {
  uploaded: "Uploaded",
  cleaned: "Cleaned",
  tokenized: "Tokenized",
  vectorized: "Vectorized",
  ready: "Ready",
};

/** GET /api/datasets */
export async function getDatasets(): Promise<Dataset[]> {
  return delay([...sessionDatasets, ...DATASETS], 280);
}

/** GET /api/datasets/:id */
export async function getDataset(id: string): Promise<Dataset | undefined> {
  return delay([...sessionDatasets, ...DATASETS].find((d) => d.id === id), 240);
}

/** POST /api/datasets/upload — file stays in browser memory for now. */
export async function uploadDataset(file: File): Promise<Dataset> {
  const format: Dataset["format"] = file.name.toLowerCase().endsWith(".json") ? "json" : "csv";
  const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
  const records = Math.max(120, Math.round(file.size / 180));
  const positive = Math.round(records * 0.41);
  const negative = Math.round(records * 0.33);
  const neutral = records - positive - negative;

  const dataset: Dataset = {
    id: `upload-${Date.now()}`,
    name: file.name.replace(/\.(csv|json)$/i, ""),
    source: "Local upload (session only)",
    format,
    records,
    labels: ["positive", "negative", "neutral"],
    status: "processing",
    stage: "uploaded",
    sizeMb,
    updatedAt: new Date().toISOString(),
    stats: {
      totalRecords: records,
      positive,
      negative,
      neutral,
      missingValues: Math.round(records * 0.004),
      duplicates: Math.round(records * 0.011),
      averageTextLength: 118,
    },
    samples: [],
  };

  sessionDatasets.unshift(dataset);
  return delay(dataset, 700);
}

/** POST /api/datasets/:id/preprocess */
export async function preprocessDataset(
  id: string,
  options: Record<string, boolean>,
): Promise<{ id: string; stage: DatasetStage; appliedSteps: string[] }> {
  const applied = Object.entries(options)
    .filter(([, enabled]) => enabled)
    .map(([step]) => step);
  const dataset = sessionDatasets.find((d) => d.id === id);
  if (dataset) {
    dataset.stage = "ready";
    dataset.status = "ready";
  }
  return delay({ id, stage: "ready" as DatasetStage, appliedSteps: applied }, 1200);
}
