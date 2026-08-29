/**
 * Domain models for Sentiment Analysis Lab.
 *
 * These interfaces mirror the response contract of the future Python backend
 * (see src/services/api-contract.ts). The UI is written against these types
 * only — swapping mock services for real REST calls requires no UI changes.
 */

export type Sentiment = "positive" | "negative" | "neutral";

export type ModelType = "traditional_ml" | "transformer";

export type ModelName =
  | "naive_bayes"
  | "logistic_regression"
  | "svm"
  | "bert"
  | "roberta";

export type ModelStatus = "ready" | "training" | "queued" | "failed" | "draft";

export type UserRole = "analyst" | "administrator";

export interface ClassProbabilities {
  positive: number;
  negative: number;
  neutral: number;
}

export interface Prediction {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  probabilities: ClassProbabilities;
  model: ModelName;
  datasetId?: string;
  datasetName?: string;
  inferenceTimeMs: number;
  createdAt: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface PerClassMetrics {
  sentiment: Sentiment;
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export interface SentimentModel {
  id: ModelName;
  name: string;
  type: ModelType;
  description: string;
  status: ModelStatus;
  metrics: ModelMetrics;
  datasetName: string;
  version: string;
  lastTrained: string;
  trainingTimeMinutes: number;
  inferenceTimeMs: number;
  hyperparameters: Record<string, string | number>;
  perClass: PerClassMetrics[];
  confusionMatrix: number[][];
}

export type DatasetStage =
  | "uploaded"
  | "cleaned"
  | "tokenized"
  | "vectorized"
  | "ready";

export type DatasetStatus = "processing" | "ready" | "failed" | "uploaded";

export interface DatasetStats {
  totalRecords: number;
  positive: number;
  negative: number;
  neutral: number;
  missingValues: number;
  duplicates: number;
  averageTextLength: number;
}

export interface DatasetSample {
  text: string;
  label: Sentiment;
}

export interface Dataset {
  id: string;
  name: string;
  source: string;
  format: "csv" | "json";
  records: number;
  labels: Sentiment[];
  status: DatasetStatus;
  stage: DatasetStage;
  sizeMb: number;
  updatedAt: string;
  stats: DatasetStats;
  samples: DatasetSample[];
}

export type TrainingStatus =
  | "idle"
  | "queued"
  | "running"
  | "completed"
  | "failed";

export interface TrainingEpoch {
  epoch: number;
  trainLoss: number;
  validationLoss: number;
  accuracy: number;
}

export interface TrainingJob {
  id: string;
  modelName: ModelName;
  datasetId: string;
  status: TrainingStatus;
  progress: number;
  currentEpoch: number;
  totalEpochs: number;
  epochs: TrainingEpoch[];
  metrics?: ModelMetrics;
  startedAt: string;
  message?: string;
}

export type ExplanationMethod = "shap" | "attention";

export interface TokenAttribution {
  token: string;
  /** Signed contribution in [-1, 1]; positive pushes toward the predicted class. */
  weight: number;
}

export interface Explanation {
  predictionId: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  model: ModelName;
  method: ExplanationMethod;
  tokens: TokenAttribution[];
  summary: string;
}

export interface TrendPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface AnalyticsData {
  totalPredictions: number;
  distribution: { sentiment: Sentiment; count: number; share: number }[];
  trend: TrendPoint[];
  modelMetrics: { model: ModelName; label: string; type: ModelType; metrics: ModelMetrics }[];
  confusionMatrix: { labels: Sentiment[]; matrix: number[][]; model: ModelName };
  perClass: PerClassMetrics[];
  bestModelAccuracy: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
  lastActive: string;
  predictions: number;
}

export interface AnalyticsFilters {
  range: "7d" | "30d" | "90d" | "custom";
  datasetId?: string;
  model?: ModelName | "all";
}

export interface HistoryFilters {
  search?: string;
  model?: ModelName | "all";
  sentiment?: Sentiment | "all";
  minConfidence?: number;
}
