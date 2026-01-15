import { z } from "zod";

// Zod schema for a single metric score
export const MetricScoreSchema = z.object({
  score: z.number().min(0).max(5),
  evidence: z.array(z.string()),
  explanation: z.string(),
});

// Zod schema for all scores
export const ScoresSchema = z.object({
  npoV_deviation: MetricScoreSchema,
  emotive_language: MetricScoreSchema,
  certainty_inflation: MetricScoreSchema,
  attribution_balance: MetricScoreSchema,
  source_asymmetry: MetricScoreSchema,
  dehumanization_cues: MetricScoreSchema,
});

// Zod schema for article JSON
export const ArticleSchema = z.object({
  page_title: z.string(),
  wiki_language: z.string(),
  analysis_timestamp: z.string(),
  scores: ScoresSchema,
  overall_narrative_risk: z.number().min(0).max(5),
  summary: z.string(),
});

// Zod schema for comparison definition
export const ComparisonSchema = z.object({
  primary_page: z.string(),
  baseline_page: z.string(),
});

// TypeScript types
export type MetricScore = z.infer<typeof MetricScoreSchema>;
export type Scores = z.infer<typeof ScoresSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Comparison = z.infer<typeof ComparisonSchema>;

// Extended article with computed fields
export interface ArticleWithMeta extends Article {
  filename: string;
  is_baseline: boolean;
}

// Metric key type
export type MetricKey = keyof Scores;

// Metric labels for display
export const METRIC_LABELS: Record<MetricKey, string> = {
  npoV_deviation: "NPOV Deviation",
  emotive_language: "Emotive Language",
  certainty_inflation: "Certainty Inflation",
  attribution_balance: "Attribution Balance",
  source_asymmetry: "Source Asymmetry",
  dehumanization_cues: "Dehumanization Cues",
};

// All metric keys as array
export const METRIC_KEYS: MetricKey[] = [
  "npoV_deviation",
  "emotive_language",
  "certainty_inflation",
  "attribution_balance",
  "source_asymmetry",
  "dehumanization_cues",
];

// Metric info structure
export interface MetricInfo {
  key: MetricKey;
  label: string;
  score: number;
  evidence: string[];
  explanation: string;
}

// Group statistics
export interface GroupStats {
  count: number;
  meanOverallRisk: number;
  medianOverallRisk: number;
  meanMetrics: Record<MetricKey, number>;
}

// Comparison with full data
export interface ComparisonWithData {
  filename: string;
  articleA: ArticleWithMeta;
  articleB: ArticleWithMeta;
}

// Saved comparison
export interface SavedComparison {
  id: string;
  name: string;
  primary_page: string;
  baseline_page: string;
}
