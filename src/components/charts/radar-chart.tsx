"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MetricInfo, METRIC_LABELS, MetricKey } from "@/lib/types";

interface SingleRadarChartProps {
  data: MetricInfo[];
}

export function SingleRadarChart({ data }: SingleRadarChartProps) {
  const chartData = data.map((metric) => ({
    metric: metric.label,
    score: metric.score,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface CompareRadarChartProps {
  dataA: MetricInfo[];
  dataB: MetricInfo[];
  labelA: string;
  labelB: string;
}

export function CompareRadarChart({
  dataA,
  dataB,
  labelA,
  labelB,
}: CompareRadarChartProps) {
  const chartData = dataA.map((metric, i) => ({
    metric: metric.label,
    scoreA: metric.score,
    scoreB: dataB[i]?.score ?? 0,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
        <Radar
          name={labelA}
          dataKey="scoreA"
          stroke="hsl(220, 70%, 50%)"
          fill="hsl(220, 70%, 50%)"
          fillOpacity={0.3}
        />
        <Radar
          name={labelB}
          dataKey="scoreB"
          stroke="hsl(160, 60%, 45%)"
          fill="hsl(160, 60%, 45%)"
          fillOpacity={0.3}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface GroupRadarChartProps {
  primaryData: Record<MetricKey, number>;
  baselineData: Record<MetricKey, number>;
}

export function GroupRadarChart({
  primaryData,
  baselineData,
}: GroupRadarChartProps) {
  const keys = Object.keys(METRIC_LABELS) as MetricKey[];
  const chartData = keys.map((key) => ({
    metric: METRIC_LABELS[key],
    primary: primaryData[key],
    baseline: baselineData[key],
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
        <Radar
          name="Primary"
          dataKey="primary"
          stroke="hsl(0, 84%, 60%)"
          fill="hsl(0, 84%, 60%)"
          fillOpacity={0.3}
        />
        <Radar
          name="Baseline"
          dataKey="baseline"
          stroke="hsl(160, 60%, 45%)"
          fill="hsl(160, 60%, 45%)"
          fillOpacity={0.3}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
