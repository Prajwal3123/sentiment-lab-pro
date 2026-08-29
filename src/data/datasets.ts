import type { Dataset } from "@/types";

export const DATASETS: Dataset[] = [
  {
    id: "imdb-movie-reviews",
    name: "IMDb Movie Reviews",
    source: "Stanford AI Lab / IMDb",
    format: "csv",
    records: 50000,
    labels: ["positive", "negative"],
    status: "ready",
    stage: "ready",
    sizeMb: 62.4,
    updatedAt: "2026-08-19T10:12:00Z",
    stats: {
      totalRecords: 50000,
      positive: 25000,
      negative: 25000,
      neutral: 0,
      missingValues: 0,
      duplicates: 96,
      averageTextLength: 231,
    },
    samples: [
      {
        text: "A patient, beautifully acted drama that earns every one of its quiet moments.",
        label: "positive",
      },
      {
        text: "The premise is wasted on a script that never decides what it wants to say.",
        label: "negative",
      },
      {
        text: "Strong lead performance, but the second act drags badly before recovering.",
        label: "negative",
      },
    ],
  },
  {
    id: "amazon-product-reviews",
    name: "Amazon Product Reviews",
    source: "Amazon Customer Reviews Corpus",
    format: "json",
    records: 128450,
    labels: ["positive", "negative", "neutral"],
    status: "ready",
    stage: "ready",
    sizeMb: 148.9,
    updatedAt: "2026-08-24T07:45:00Z",
    stats: {
      totalRecords: 128450,
      positive: 61840,
      negative: 38210,
      neutral: 28400,
      missingValues: 412,
      duplicates: 1874,
      averageTextLength: 96,
    },
    samples: [
      {
        text: "The product quality exceeded my expectations and shipping was two days early.",
        label: "positive",
      },
      {
        text: "The camera quality is excellent, but the battery life is disappointing.",
        label: "neutral",
      },
      {
        text: "Stopped charging after three weeks and support never responded to my ticket.",
        label: "negative",
      },
    ],
  },
  {
    id: "sst-2",
    name: "SST-2 (Stanford Sentiment Treebank)",
    source: "Stanford NLP Group",
    format: "csv",
    records: 67349,
    labels: ["positive", "negative"],
    status: "ready",
    stage: "vectorized",
    sizeMb: 8.1,
    updatedAt: "2026-08-21T16:30:00Z",
    stats: {
      totalRecords: 67349,
      positive: 37569,
      negative: 29780,
      neutral: 0,
      missingValues: 0,
      duplicates: 231,
      averageTextLength: 19,
    },
    samples: [
      { text: "a sharp, funny and genuinely moving piece of work", label: "positive" },
      { text: "so lazily assembled it feels unfinished", label: "negative" },
      { text: "occasionally inspired, mostly inert", label: "negative" },
    ],
  },
  {
    id: "support-tickets-2026",
    name: "Customer Support Tickets 2026",
    source: "Internal helpdesk export",
    format: "csv",
    records: 18720,
    labels: ["positive", "negative", "neutral"],
    status: "processing",
    stage: "tokenized",
    sizeMb: 21.6,
    updatedAt: "2026-08-27T06:05:00Z",
    stats: {
      totalRecords: 18720,
      positive: 4120,
      negative: 9640,
      neutral: 4960,
      missingValues: 288,
      duplicates: 512,
      averageTextLength: 142,
    },
    samples: [
      {
        text: "Your engineer resolved the sync issue within an hour — genuinely impressed.",
        label: "positive",
      },
      {
        text: "Third escalation this month and the invoice is still wrong.",
        label: "negative",
      },
      {
        text: "Requesting confirmation on the scheduled maintenance window for Friday.",
        label: "neutral",
      },
    ],
  },
];

export const PREPROCESSING_STAGES = [
  { id: "raw", label: "Raw Dataset", detail: "Ingested records, unmodified" },
  { id: "cleaning", label: "Text Cleaning", detail: "Strip HTML, URLs, control characters" },
  { id: "normalization", label: "Normalization", detail: "Lowercase, unicode NFKC, whitespace" },
  { id: "tokenization", label: "Tokenization", detail: "Word / subword segmentation" },
  { id: "stopwords", label: "Stop-word Handling", detail: "NLTK English stop-word removal" },
  {
    id: "vectorization",
    label: "TF-IDF / Transformer Tokenization",
    detail: "Sparse features or WordPiece IDs",
  },
  { id: "processed", label: "Processed Dataset", detail: "Train / test splits materialised" },
] as const;
