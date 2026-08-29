import { MODELS, MODEL_ORDER } from "@/data/models";
import { buildExplanation, PREDICTIONS } from "@/data/predictions";
import type {
  ClassProbabilities,
  Explanation,
  ExplanationMethod,
  ModelName,
  Prediction,
  Sentiment,
} from "@/types";
import { delay } from "./api-contract";

/**
 * MOCK INFERENCE ENGINE
 * ------------------------------------------------------------------
 * This is a deterministic lexicon heuristic used purely to populate the
 * interface. It is NOT a machine learning model and makes no claim to be.
 * Replace `analyzeText` with `POST /api/analyze` when the Python service
 * is available; the returned shape is already the production contract.
 */

const POSITIVE_LEXICON = [
  "excellent", "great", "love", "loved", "amazing", "superb", "exceeded",
  "impressed", "perfect", "perfectly", "recommend", "fantastic", "reliable",
  "beautiful", "smooth", "fast", "worth", "happy", "best", "outstanding",
];

const NEGATIVE_LEXICON = [
  "bad", "poor", "terrible", "awful", "disappointing", "disappointed", "waste",
  "broken", "slow", "delayed", "refund", "worst", "useless", "cheap",
  "overpriced", "unclear", "failed", "hate", "wrong", "defective",
];

const CONTRAST_TOKENS = ["but", "however", "although", "though", "yet"];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function score(text: string) {
  const tokens = tokenize(text);
  let positive = 0;
  let negative = 0;
  let contrast = 0;
  tokens.forEach((token) => {
    if (POSITIVE_LEXICON.includes(token)) positive += 1;
    if (NEGATIVE_LEXICON.includes(token)) negative += 1;
    if (CONTRAST_TOKENS.includes(token)) contrast += 1;
  });
  return { tokens, positive, negative, contrast };
}

/** Transformer models get a small confidence premium, matching benchmark reality. */
function modelBias(model: ModelName): number {
  const m = MODELS.find((entry) => entry.id === model);
  return m ? m.metrics.accuracy : 0.8;
}

function normalise(p: ClassProbabilities): ClassProbabilities {
  const total = p.positive + p.negative + p.neutral;
  return {
    positive: Number((p.positive / total).toFixed(4)),
    negative: Number((p.negative / total).toFixed(4)),
    neutral: Number((p.neutral / total).toFixed(4)),
  };
}

function classify(text: string, model: ModelName): {
  sentiment: Sentiment;
  probabilities: ClassProbabilities;
  confidence: number;
} {
  const { tokens, positive, negative, contrast } = score(text);
  const bias = modelBias(model);
  const length = Math.max(tokens.length, 1);

  const mixed = positive > 0 && negative > 0;
  let raw: ClassProbabilities = {
    positive: 0.2 + positive * 0.9,
    negative: 0.2 + negative * 0.9,
    neutral: 0.35 + (mixed ? 1.1 : 0) + contrast * 0.5 + Math.max(0, 1 - length / 12),
  };

  raw = normalise(raw);
  const entries: [Sentiment, number][] = [
    ["positive", raw.positive],
    ["negative", raw.negative],
    ["neutral", raw.neutral],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0]!;

  // Sharpen the distribution proportionally to the model's benchmark accuracy.
  const sharpen = 1 + (bias - 0.7) * 6;
  const sharpened = normalise({
    positive: Math.pow(raw.positive, sharpen),
    negative: Math.pow(raw.negative, sharpen),
    neutral: Math.pow(raw.neutral, sharpen),
  });

  const confidence = Math.max(sharpened.positive, sharpened.negative, sharpened.neutral);

  return { sentiment: top[0], probabilities: sharpened, confidence };
}

let counter = 0;

function makePrediction(text: string, model: ModelName): Prediction {
  const { sentiment, probabilities, confidence } = classify(text, model);
  const modelMeta = MODELS.find((m) => m.id === model);
  counter += 1;
  return {
    id: `pred_live_${counter}`,
    text,
    sentiment,
    confidence,
    probabilities,
    model,
    inferenceTimeMs: modelMeta?.inferenceTimeMs ?? 10,
    createdAt: new Date().toISOString(),
  };
}

/** POST /api/analyze */
export async function analyzeText(text: string, model: ModelName): Promise<Prediction> {
  if (!text.trim()) throw new Error("Input text is required.");
  return delay(makePrediction(text, model), 900);
}

/** POST /api/analyze/compare */
export async function compareModels(text: string): Promise<Prediction[]> {
  if (!text.trim()) throw new Error("Input text is required.");
  return delay(
    MODEL_ORDER.map((model) => makePrediction(text, model)),
    1300,
  );
}

/** GET /api/predictions/:id/explanation */
export async function getExplanation(
  predictionId: string,
  method: ExplanationMethod = "shap",
): Promise<Explanation | undefined> {
  const prediction = PREDICTIONS.find((p) => p.id === predictionId);
  if (!prediction) return delay(undefined, 200);
  return delay(buildExplanation(prediction, method), 520);
}

/** Local explanation for a prediction that only exists in client state. */
export async function explainPrediction(
  prediction: Prediction,
  method: ExplanationMethod = "shap",
): Promise<Explanation> {
  return delay(buildExplanation(prediction, method), 520);
}
