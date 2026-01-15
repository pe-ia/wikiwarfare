"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import { MetricInfo, METRIC_LABELS, MetricKey } from "@/lib/types";
import { getRiskColor } from "@/lib/stats";

interface SingleBarChartProps {
  data: MetricInfo[];
}

export function SingleBarChart({ data }: SingleBarChartProps) {
  const chartData = data.map((metric) => ({
    name: metric.label.split(" ")[0], // Abbreviated label
    fullName: metric.label,
    score: metric.score,
  }));

  const getBarColor = (score: number) => {
    if (score <= 1) return "hsl(142, 71%, 45%)";
    if (score <= 2) return "hsl(84, 81%, 44%)";
    if (score <= 3) return "hsl(48, 96%, 53%)";
    if (score <= 4) return "hsl(27, 96%, 61%)";
    return "hsl(0, 84%, 60%)";
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 5]} />
        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number) => [value.toFixed(2), "Score"]}
          labelFormatter={(label) => {
            const item = chartData.find((d) => d.name === label);
            return item?.fullName ?? label;
          }}
        />
        <Bar dataKey="score" name="Score">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DeltaBarChartProps {
  dataA: MetricInfo[];
  dataB: MetricInfo[];
  labelA: string;
  labelB: string;
}

export function DeltaBarChart({
  dataA,
  dataB,
  labelA,
  labelB,
}: DeltaBarChartProps) {
  // Delta = A - B (how much higher primary is than baseline)
  const chartData = dataA.map((metric, i) => ({
    name: metric.label.split(" ")[0],
    fullName: metric.label,
    delta: metric.score - (dataB[i]?.score ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[-5, 5]} />
        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number) => [
            value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2),
            `${labelA} - ${labelB}`,
          ]}
          labelFormatter={(label) => {
            const item = chartData.find((d) => d.name === label);
            return item?.fullName ?? label;
          }}
        />
        <ReferenceLine x={0} stroke="hsl(var(--foreground))" />
        <Bar dataKey="delta" name={`Delta (${labelB} - ${labelA})`}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.delta >= 0 ? "hsl(0, 84%, 60%)" : "hsl(142, 71%, 45%)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface HistogramChartProps {
  data: { bucket: string; primary?: number; baseline?: number; count?: number }[];
  singleGroup?: boolean;
}

export function HistogramChart({ data, singleGroup = false }: HistogramChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        {singleGroup ? (
          <Bar dataKey="count" name="Articles" fill="hsl(var(--primary))" />
        ) : (
          <>
            <Bar dataKey="primary" name="Primary" fill="hsl(0, 84%, 60%)" />
            <Bar dataKey="baseline" name="Baseline" fill="hsl(142, 71%, 45%)" />
          </>
        )}
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DivergenceBarChartProps {
  data: { key: MetricKey; label: string; delta: number }[];
}

export function DivergenceBarChart({ data }: DivergenceBarChartProps) {
  const chartData = data.map((d) => ({
    name: d.label.split(" ")[0],
    fullName: d.label,
    delta: d.delta,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[-3, 3]} />
        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number) => [
            value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2),
            "Primary - Baseline",
          ]}
          labelFormatter={(label) => {
            const item = chartData.find((d) => d.name === label);
            return item?.fullName ?? label;
          }}
        />
        <ReferenceLine x={0} stroke="hsl(var(--foreground))" />
        <Bar dataKey="delta" name="Delta (Primary - Baseline)">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.delta >= 0 ? "hsl(0, 84%, 60%)" : "hsl(142, 71%, 45%)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
