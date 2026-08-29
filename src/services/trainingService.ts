import type { ModelName, TrainingEpoch, TrainingJob } from "@/types";
import { delay } from "./api-contract";

export interface TrainingConfig {
  datasetId: string;
  modelName: ModelName;
  // Traditional ML
  vectorizer?: string;
  ngramRange?: string;
  maxFeatures?: number;
  trainTestSplit?: number;
  // Transformer
  maxSequenceLength?: number;
  batchSize?: number;
  epochs?: number;
  learningRate?: string;
  // Preprocessing
  lowercase?: boolean;
  removeStopwords?: boolean;
}

/**
 * SIMULATED TRAINING
 * ------------------------------------------------------------------
 * No model is trained here. The job below advances a synthetic progress
 * curve so the UI can exercise queued / running / completed states.
 * Real implementation: POST /api/training/start then poll
 * GET /api/training/:id until status is "completed" or "failed".
 */

const jobs = new Map<string, TrainingJob>();

export async function startTraining(config: TrainingConfig): Promise<TrainingJob> {
  const id = `job_${Date.now().toString(36)}`;
  const totalEpochs = config.epochs ?? 4;
  const job: TrainingJob = {
    id,
    modelName: config.modelName,
    datasetId: config.datasetId,
    status: "queued",
    progress: 0,
    currentEpoch: 0,
    totalEpochs,
    epochs: [],
    startedAt: new Date().toISOString(),
    message: "Job queued — simulated scheduler",
  };
  jobs.set(id, job);
  return delay(job, 500);
}

export async function getTrainingStatus(id: string): Promise<TrainingJob | undefined> {
  const job = jobs.get(id);
  if (!job) return undefined;

  if (job.status === "completed" || job.status === "failed") return { ...job };

  const step = 100 / (job.totalEpochs * 5);
  const progress = Math.min(100, job.progress + step * 2);
  job.progress = progress;
  job.status = progress > 0 ? "running" : "queued";
  job.message = `Simulated epoch ${Math.min(job.totalEpochs, Math.ceil((progress / 100) * job.totalEpochs))} of ${job.totalEpochs}`;

  const epochIndex = Math.floor((progress / 100) * job.totalEpochs);
  while (job.epochs.length < epochIndex && job.epochs.length < job.totalEpochs) {
    const n = job.epochs.length + 1;
    const epoch: TrainingEpoch = {
      epoch: n,
      trainLoss: Number((0.68 / n + 0.06).toFixed(4)),
      validationLoss: Number((0.74 / n + 0.09).toFixed(4)),
      accuracy: Number((0.79 + 0.035 * Math.log2(n + 1)).toFixed(4)),
    };
    job.epochs.push(epoch);
    job.currentEpoch = n;
  }

  if (progress >= 100) {
    job.status = "completed";
    job.currentEpoch = job.totalEpochs;
    const last = job.epochs[job.epochs.length - 1];
    const accuracy = last?.accuracy ?? 0.9;
    job.metrics = {
      accuracy,
      precision: Number((accuracy - 0.008).toFixed(4)),
      recall: Number((accuracy - 0.003).toFixed(4)),
      f1: Number((accuracy - 0.006).toFixed(4)),
    };
    job.message = "Simulated run complete";
  }

  return { ...job };
}

export function resetTraining(id: string) {
  jobs.delete(id);
}
