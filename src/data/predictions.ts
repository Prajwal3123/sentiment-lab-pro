import type { Explanation, ModelName, Prediction, Sentiment } from "@/types";

interface Seed {
  text: string;
  sentiment: Sentiment;
  confidence: number;
  probabilities: [number, number, number]; // positive, neutral, negative
  model: ModelName;
  datasetId: string;
  datasetName: string;
  inferenceTimeMs: number;
  minutesAgo: number;
}

const SEEDS: Seed[] = [
  {
    text: "The product quality exceeded my expectations.",
    sentiment: "positive",
    confidence: 0.964,
    probabilities: [0.964, 0.021, 0.015],
    model: "bert",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 42,
    minutesAgo: 4,
  },
  {
    text: "The camera quality is excellent, but the battery life is disappointing.",
    sentiment: "neutral",
    confidence: 0.612,
    probabilities: [0.244, 0.612, 0.144],
    model: "roberta",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 47,
    minutesAgo: 11,
  },
  {
    text: "Delivery was delayed twice and nobody bothered to notify me.",
    sentiment: "negative",
    confidence: 0.941,
    probabilities: [0.014, 0.045, 0.941],
    model: "svm",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 5,
    minutesAgo: 23,
  },
  {
    text: "A patient, beautifully acted drama that earns every one of its quiet moments.",
    sentiment: "positive",
    confidence: 0.932,
    probabilities: [0.932, 0.049, 0.019],
    model: "roberta",
    datasetId: "imdb-movie-reviews",
    datasetName: "IMDb Movie Reviews",
    inferenceTimeMs: 45,
    minutesAgo: 38,
  },
  {
    text: "Setup instructions were unclear, though support resolved it quickly.",
    sentiment: "neutral",
    confidence: 0.583,
    probabilities: [0.312, 0.583, 0.105],
    model: "logistic_regression",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 4,
    minutesAgo: 52,
  },
  {
    text: "Completely stopped working after three weeks. Waste of money.",
    sentiment: "negative",
    confidence: 0.978,
    probabilities: [0.008, 0.014, 0.978],
    model: "bert",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 40,
    minutesAgo: 74,
  },
  {
    text: "Battery lasts a full working day and the display is genuinely superb.",
    sentiment: "positive",
    confidence: 0.957,
    probabilities: [0.957, 0.028, 0.015],
    model: "bert",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 43,
    minutesAgo: 96,
  },
  {
    text: "The plot is predictable but the cinematography carries the film.",
    sentiment: "neutral",
    confidence: 0.541,
    probabilities: [0.352, 0.541, 0.107],
    model: "svm",
    datasetId: "imdb-movie-reviews",
    datasetName: "IMDb Movie Reviews",
    inferenceTimeMs: 5,
    minutesAgo: 121,
  },
  {
    text: "Overpriced for what it delivers, and the build feels cheap.",
    sentiment: "negative",
    confidence: 0.889,
    probabilities: [0.032, 0.079, 0.889],
    model: "logistic_regression",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 4,
    minutesAgo: 160,
  },
  {
    text: "Your engineer resolved the sync issue within an hour — genuinely impressed.",
    sentiment: "positive",
    confidence: 0.948,
    probabilities: [0.948, 0.037, 0.015],
    model: "roberta",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 46,
    minutesAgo: 210,
  },
  {
    text: "Requesting confirmation on the scheduled maintenance window for Friday.",
    sentiment: "neutral",
    confidence: 0.871,
    probabilities: [0.061, 0.871, 0.068],
    model: "bert",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 39,
    minutesAgo: 275,
  },
  {
    text: "Sound quality is average at best; noise cancellation barely works.",
    sentiment: "negative",
    confidence: 0.823,
    probabilities: [0.052, 0.125, 0.823],
    model: "naive_bayes",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 3,
    minutesAgo: 340,
  },
  {
    text: "Fits perfectly, arrived early, and the fabric is much better than photos suggest.",
    sentiment: "positive",
    confidence: 0.912,
    probabilities: [0.912, 0.058, 0.03],
    model: "logistic_regression",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 4,
    minutesAgo: 410,
  },
  {
    text: "It works as described. Nothing remarkable, nothing broken.",
    sentiment: "neutral",
    confidence: 0.784,
    probabilities: [0.146, 0.784, 0.07],
    model: "roberta",
    datasetId: "amazon-product-reviews",
    datasetName: "Amazon Product Reviews",
    inferenceTimeMs: 44,
    minutesAgo: 520,
  },
  {
    text: "Third escalation this month and the invoice is still wrong.",
    sentiment: "negative",
    confidence: 0.955,
    probabilities: [0.011, 0.034, 0.955],
    model: "bert",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 41,
    minutesAgo: 640,
  },
  {
    text: "An ambitious sequel that mostly justifies its two-and-a-half hour runtime.",
    sentiment: "positive",
    confidence: 0.807,
    probabilities: [0.807, 0.142, 0.051],
    model: "svm",
    datasetId: "imdb-movie-reviews",
    datasetName: "IMDb Movie Reviews",
    inferenceTimeMs: 5,
    minutesAgo: 760,
  },
  {
    text: "so lazily assembled it feels unfinished",
    sentiment: "negative",
    confidence: 0.902,
    probabilities: [0.026, 0.072, 0.902],
    model: "roberta",
    datasetId: "sst-2",
    datasetName: "SST-2",
    inferenceTimeMs: 45,
    minutesAgo: 880,
  },
  {
    text: "a sharp, funny and genuinely moving piece of work",
    sentiment: "positive",
    confidence: 0.971,
    probabilities: [0.971, 0.019, 0.01],
    model: "bert",
    datasetId: "sst-2",
    datasetName: "SST-2",
    inferenceTimeMs: 40,
    minutesAgo: 1010,
  },
  {
    text: "The interface is powerful once you learn it, but onboarding is rough.",
    sentiment: "neutral",
    confidence: 0.629,
    probabilities: [0.271, 0.629, 0.1],
    model: "logistic_regression",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 4,
    minutesAgo: 1180,
  },
  {
    text: "Refund was processed without argument — that alone earned my repeat business.",
    sentiment: "positive",
    confidence: 0.893,
    probabilities: [0.893, 0.071, 0.036],
    model: "naive_bayes",
    datasetId: "support-tickets-2026",
    datasetName: "Customer Support Tickets 2026",
    inferenceTimeMs: 3,
    minutesAgo: 1400,
  },
];

/** Deterministic timestamps anchored to a fixed epoch so SSR and client agree. */
const ANCHOR = Date.parse("2026-08-27T18:00:00Z");

export const PREDICTIONS: Prediction[] = SEEDS.map((seed, index) => ({
  id: `pred_${(1024 + index).toString(16)}`,
  text: seed.text,
  sentiment: seed.sentiment,
  confidence: seed.confidence,
  probabilities: {
    positive: seed.probabilities[0],
    neutral: seed.probabilities[1],
    negative: seed.probabilities[2],
  },
  model: seed.model,
  datasetId: seed.datasetId,
  datasetName: seed.datasetName,
  inferenceTimeMs: seed.inferenceTimeMs,
  createdAt: new Date(ANCHOR - seed.minutesAgo * 60_000).toISOString(),
}));

/** Token attributions per prediction id. Replaced by real SHAP / attention output. */
const TOKEN_MAP: Record<string, { token: string; weight: number }[]> = {
  pred_400: [
    { token: "The", weight: 0.02 },
    { token: "product", weight: 0.11 },
    { token: "quality", weight: 0.34 },
    { token: "exceeded", weight: 0.82 },
    { token: "my", weight: 0.03 },
    { token: "expectations", weight: 0.71 },
    { token: ".", weight: 0.0 },
  ],
  pred_401: [
    { token: "The", weight: 0.01 },
    { token: "camera", weight: 0.18 },
    { token: "quality", weight: 0.29 },
    { token: "is", weight: 0.02 },
    { token: "excellent", weight: 0.91 },
    { token: ",", weight: 0.0 },
    { token: "but", weight: -0.44 },
    { token: "the", weight: 0.0 },
    { token: "battery", weight: -0.31 },
    { token: "life", weight: -0.27 },
    { token: "is", weight: -0.04 },
    { token: "disappointing", weight: -0.88 },
    { token: ".", weight: 0.0 },
  ],
};

export function buildExplanation(
  prediction: Prediction,
  method: "shap" | "attention",
): Explanation {
  const tokens =
    TOKEN_MAP[prediction.id] ??
    prediction.text.split(/\s+/).map((token, index) => {
      const polarity = prediction.sentiment === "negative" ? -1 : 1;
      const base = /[.,!?]$/.test(token) ? 0 : ((index * 37) % 11) / 14;
      const lowered = token.toLowerCase().replace(/[^a-z]/g, "");
      const strong = STRONG_TOKENS[lowered];
      return {
        token,
        weight: strong ?? Number((base * polarity).toFixed(2)),
      };
    });

  const scaled =
    method === "attention"
      ? tokens.map((t) => ({ token: t.token, weight: Number((Math.abs(t.weight) * 0.92).toFixed(2)) }))
      : tokens;

  return {
    predictionId: prediction.id,
    text: prediction.text,
    sentiment: prediction.sentiment,
    confidence: prediction.confidence,
    model: prediction.model,
    method,
    tokens: scaled,
    summary:
      method === "shap"
        ? "SHAP values quantify each token's signed contribution to the predicted class relative to the dataset baseline."
        : "Attention weights aggregate the final-layer [CLS] attention mass distributed across input tokens.",
  };
}

const STRONG_TOKENS: Record<string, number> = {
  excellent: 0.91,
  superb: 0.86,
  impressed: 0.84,
  exceeded: 0.82,
  perfectly: 0.78,
  funny: 0.74,
  moving: 0.7,
  disappointing: -0.88,
  waste: -0.86,
  wrong: -0.79,
  delayed: -0.71,
  overpriced: -0.75,
  cheap: -0.62,
  unclear: -0.55,
  lazily: -0.8,
  unfinished: -0.68,
  but: -0.44,
  though: -0.28,
};
