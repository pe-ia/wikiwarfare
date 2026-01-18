import {
  ArticleWithMeta,
  GroupStats,
  MetricKey,
  METRIC_KEYS,
  MetricInfo,
  METRIC_LABELS,
} from "./types";

// Calculate mean of an array of numbers
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// Calculate median of an array of numbers
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Group articles by baseline status
export function groupByBaseline(
  articles: ArticleWithMeta[]
): { baselines: ArticleWithMeta[]; primaries: ArticleWithMeta[] } {
  const baselines: ArticleWithMeta[] = [];
  const primaries: ArticleWithMeta[] = [];

  for (const article of articles) {
    if (article.is_baseline) {
      baselines.push(article);
    } else {
      primaries.push(article);
    }
  }

  return { baselines, primaries };
}

// Compute statistics for a group of articles
export function computeGroupStats(articles: ArticleWithMeta[]): GroupStats {
  if (articles.length === 0) {
    return {
      count: 0,
      meanOverallRisk: 0,
      medianOverallRisk: 0,
      meanMetrics: METRIC_KEYS.reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {} as Record<MetricKey, number>
      ),
    };
  }

  const overallRisks = articles.map((a) => getOverallRisk(a));
  const meanMetrics: Record<MetricKey, number> = {} as Record<
    MetricKey,
    number
  >;

  for (const key of METRIC_KEYS) {
    const scores = articles.map((a) => a.scores[key].score);
    meanMetrics[key] = mean(scores);
  }

  return {
    count: articles.length,
    meanOverallRisk: mean(overallRisks),
    medianOverallRisk: median(overallRisks),
    meanMetrics,
  };
}

// Create histogram buckets for scores (0-5 scale)
export function createHistogramBuckets(
  values: number[],
  bucketCount: number = 6
): { bucket: string; count: number }[] {
  const buckets: { bucket: string; count: number }[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const bucketLabel = i === bucketCount - 1 ? `${i}+` : `${i}-${i + 1}`;
    buckets.push({ bucket: bucketLabel, count: 0 });
  }

  for (const value of values) {
    const bucketIndex = Math.min(Math.floor(value), bucketCount - 1);
    buckets[bucketIndex].count++;
  }

  return buckets;
}

// Extract metric info array from an article
export function metricArray(article: ArticleWithMeta): MetricInfo[] {
  return METRIC_KEYS.map((key) => ({
    key,
    label: METRIC_LABELS[key],
    score: article.scores[key].score,
    evidence: article.scores[key].evidence,
    explanation: article.scores[key].explanation,
  }));
}

// Calculate metric divergence between two groups
export function calculateMetricDivergence(
  primaryStats: GroupStats,
  baselineStats: GroupStats
): { key: MetricKey; label: string; delta: number; absValue: number }[] {
  return METRIC_KEYS.map((key) => ({
    key,
    label: METRIC_LABELS[key],
    delta: primaryStats.meanMetrics[key] - baselineStats.meanMetrics[key],
    absValue: Math.abs(
      primaryStats.meanMetrics[key] - baselineStats.meanMetrics[key]
    ),
  })).sort((a, b) => b.absValue - a.absValue);
}

// Calculate mean of the 6 metrics for an article (experimental replacement for overall_narrative_risk)
export function getOverallRisk(article: ArticleWithMeta): number {
  const scores = METRIC_KEYS.map((key) => article.scores[key].score);
  return mean(scores);
}

// Round to specified decimal places
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Get risk level badge color
export function getRiskColor(score: number): string {
  if (score <= 1) return "bg-green-500";
  if (score <= 2) return "bg-lime-500";
  if (score <= 3) return "bg-yellow-500";
  if (score <= 4) return "bg-orange-500";
  return "bg-red-500";
}

// Get risk level label
export function getRiskLabel(score: number): string {
  if (score <= 1) return "Low";
  if (score <= 2) return "Moderate";
  if (score <= 3) return "Elevated";
  if (score <= 4) return "High";
  return "Severe";
}
