import type { ModelName, ModelType, SentimentModel } from "@/types";

/** Display metadata shared by every screen that renders a model reference. */
export const MODEL_LABELS: Record<ModelName, string> = {
  naive_bayes: "Naive Bayes",
  logistic_regression: "Logistic Regression",
  svm: "Support Vector Machine",
  bert: "BERT",
  roberta: "RoBERTa",
};

export const MODEL_SHORT_LABELS: Record<ModelName, string> = {
  naive_bayes: "Naive Bayes",
  logistic_regression: "Log. Regression",
  svm: "SVM",
  bert: "BERT",
  roberta: "RoBERTa",
};

export const MODEL_TYPES: Record<ModelName, ModelType> = {
  naive_bayes: "traditional_ml",
  logistic_regression: "traditional_ml",
  svm: "traditional_ml",
  bert: "transformer",
  roberta: "transformer",
};

export const MODEL_TYPE_LABELS: Record<ModelType, string> = {
  traditional_ml: "Traditional Machine Learning",
  transformer: "Transformer-based Model",
};

export const MODEL_ORDER: ModelName[] = [
  "naive_bayes",
  "logistic_regression",
  "svm",
  "bert",
  "roberta",
];

export const MODELS: SentimentModel[] = [
  {
    id: "naive_bayes",
    name: "Naive Bayes",
    type: "traditional_ml",
    description:
      "Multinomial Naive Bayes over TF-IDF unigram/bigram features. Fastest baseline, strong on high-signal lexical cues.",
    status: "ready",
    metrics: { accuracy: 0.762, precision: 0.745, recall: 0.721, f1: 0.733 },
    datasetName: "IMDb Movie Reviews",
    version: "v1.4.0",
    lastTrained: "2026-08-11T09:24:00Z",
    trainingTimeMinutes: 1.2,
    inferenceTimeMs: 3.1,
    hyperparameters: {
      vectorizer: "TF-IDF",
      ngram_range: "(1, 2)",
      max_features: 20000,
      alpha: 0.6,
      train_test_split: "80 / 20",
    },
    perClass: [
      { sentiment: "positive", precision: 0.781, recall: 0.766, f1: 0.773, support: 4180 },
      { sentiment: "negative", precision: 0.752, recall: 0.734, f1: 0.743, support: 3960 },
      { sentiment: "neutral", precision: 0.702, recall: 0.663, f1: 0.682, support: 2860 },
    ],
    confusionMatrix: [
      [3202, 512, 466],
      [498, 2907, 555],
      [604, 362, 1894],
    ],
  },
  {
    id: "logistic_regression",
    name: "Logistic Regression",
    type: "traditional_ml",
    description:
      "L2-regularised logistic regression on TF-IDF features. Well-calibrated probabilities and interpretable coefficients.",
    status: "ready",
    metrics: { accuracy: 0.814, precision: 0.802, recall: 0.798, f1: 0.8 },
    datasetName: "IMDb Movie Reviews",
    version: "v2.1.0",
    lastTrained: "2026-08-14T14:02:00Z",
    trainingTimeMinutes: 3.8,
    inferenceTimeMs: 4.6,
    hyperparameters: {
      vectorizer: "TF-IDF",
      ngram_range: "(1, 2)",
      max_features: 50000,
      C: 4.0,
      solver: "liblinear",
      train_test_split: "80 / 20",
    },
    perClass: [
      { sentiment: "positive", precision: 0.836, recall: 0.842, f1: 0.839, support: 4180 },
      { sentiment: "negative", precision: 0.812, recall: 0.804, f1: 0.808, support: 3960 },
      { sentiment: "neutral", precision: 0.758, recall: 0.748, f1: 0.753, support: 2860 },
    ],
    confusionMatrix: [
      [3520, 342, 318],
      [356, 3184, 420],
      [364, 357, 2139],
    ],
  },
  {
    id: "svm",
    name: "Support Vector Machine",
    type: "traditional_ml",
    description:
      "Linear SVM with squared-hinge loss. Strongest traditional baseline on sparse high-dimensional text features.",
    status: "ready",
    metrics: { accuracy: 0.839, precision: 0.827, recall: 0.815, f1: 0.821 },
    datasetName: "Amazon Product Reviews",
    version: "v2.3.1",
    lastTrained: "2026-08-18T08:47:00Z",
    trainingTimeMinutes: 7.4,
    inferenceTimeMs: 5.2,
    hyperparameters: {
      vectorizer: "TF-IDF",
      ngram_range: "(1, 3)",
      max_features: 75000,
      C: 1.0,
      loss: "squared_hinge",
      train_test_split: "80 / 20",
    },
    perClass: [
      { sentiment: "positive", precision: 0.861, recall: 0.869, f1: 0.865, support: 4180 },
      { sentiment: "negative", precision: 0.838, recall: 0.826, f1: 0.832, support: 3960 },
      { sentiment: "neutral", precision: 0.782, recall: 0.75, f1: 0.766, support: 2860 },
    ],
    confusionMatrix: [
      [3632, 286, 262],
      [304, 3271, 385],
      [325, 350, 2185],
    ],
  },
  {
    id: "bert",
    name: "BERT",
    type: "transformer",
    description:
      "bert-base-uncased fine-tuned for 3-class sentiment. Captures contextual negation and long-range dependencies.",
    status: "ready",
    metrics: { accuracy: 0.918, precision: 0.905, recall: 0.912, f1: 0.908 },
    datasetName: "SST-2 + Amazon Product Reviews",
    version: "v3.0.2",
    lastTrained: "2026-08-22T18:10:00Z",
    trainingTimeMinutes: 96,
    inferenceTimeMs: 41.8,
    hyperparameters: {
      checkpoint: "bert-base-uncased",
      max_seq_length: 128,
      batch_size: 32,
      epochs: 4,
      learning_rate: "2e-5",
      optimizer: "AdamW",
    },
    perClass: [
      { sentiment: "positive", precision: 0.934, recall: 0.941, f1: 0.937, support: 4180 },
      { sentiment: "negative", precision: 0.916, recall: 0.921, f1: 0.918, support: 3960 },
      { sentiment: "neutral", precision: 0.864, recall: 0.874, f1: 0.869, support: 2860 },
    ],
    confusionMatrix: [
      [3933, 132, 115],
      [141, 3647, 172],
      [136, 224, 2500],
    ],
  },
  {
    id: "roberta",
    name: "RoBERTa",
    type: "transformer",
    description:
      "roberta-base fine-tuned with dynamic masking pretraining. Best overall accuracy and neutral-class separation.",
    status: "ready",
    metrics: { accuracy: 0.924, precision: 0.916, recall: 0.921, f1: 0.918 },
    datasetName: "SST-2 + Amazon Product Reviews",
    version: "v3.1.0",
    lastTrained: "2026-08-25T11:36:00Z",
    trainingTimeMinutes: 112,
    inferenceTimeMs: 46.3,
    hyperparameters: {
      checkpoint: "roberta-base",
      max_seq_length: 160,
      batch_size: 16,
      epochs: 4,
      learning_rate: "1e-5",
      optimizer: "AdamW",
    },
    perClass: [
      { sentiment: "positive", precision: 0.941, recall: 0.948, f1: 0.944, support: 4180 },
      { sentiment: "negative", precision: 0.924, recall: 0.928, f1: 0.926, support: 3960 },
      { sentiment: "neutral", precision: 0.879, recall: 0.882, f1: 0.88, support: 2860 },
    ],
    confusionMatrix: [
      [3963, 116, 101],
      [128, 3675, 157],
      [122, 216, 2522],
    ],
  },
];
