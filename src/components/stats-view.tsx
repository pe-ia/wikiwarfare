"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArticleWithMeta,
  GroupStats,
  METRIC_KEYS,
  METRIC_LABELS,
  MetricKey,
} from "@/lib/types";
import {
  computeGroupStats,
  createHistogramBuckets,
  calculateMetricDivergence,
  roundTo,
} from "@/lib/stats";
import { slugifyTitle } from "@/lib/baselines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiskBadge, TypeBadge } from "@/components/risk-badge";
import { HistogramChart, DivergenceBarChart } from "@/components/charts/bar-chart";
import { GroupRadarChart } from "@/components/charts/radar-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Search } from "lucide-react";

interface StatsViewProps {
  articles: ArticleWithMeta[];
}

type SortField = "title" | "overall_risk" | MetricKey;
type SortDirection = "asc" | "desc";
type FilterGroup = "all" | "primary" | "baseline";

export function StatsView({ articles }: StatsViewProps) {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<FilterGroup>("all");
  const [sortField, setSortField] = useState<SortField>("overall_risk");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [riskRange, setRiskRange] = useState<[number, number]>([0, 5]);

  // Compute group stats
  const { baselines, primaries, baselineStats, primaryStats } = useMemo(() => {
    const baselines = articles.filter((a) => a.is_baseline);
    const primaries = articles.filter((a) => !a.is_baseline);
    return {
      baselines,
      primaries,
      baselineStats: computeGroupStats(baselines),
      primaryStats: computeGroupStats(primaries),
    };
  }, [articles]);

  // Compute histogram data
  const histogramData = useMemo(() => {
    const primaryBuckets = createHistogramBuckets(
      primaries.map((a) => a.overall_narrative_risk)
    );
    const baselineBuckets = createHistogramBuckets(
      baselines.map((a) => a.overall_narrative_risk)
    );

    return primaryBuckets.map((pb, i) => ({
      bucket: pb.bucket,
      primary: pb.count,
      baseline: baselineBuckets[i].count,
    }));
  }, [primaries, baselines]);

  // Compute divergence data
  const divergenceData = useMemo(() => {
    return calculateMetricDivergence(primaryStats, baselineStats);
  }, [primaryStats, baselineStats]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Filter by group
    if (filterGroup === "primary") {
      result = result.filter((a) => !a.is_baseline);
    } else if (filterGroup === "baseline") {
      result = result.filter((a) => a.is_baseline);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((a) =>
        a.page_title.toLowerCase().includes(searchLower)
      );
    }

    // Filter by risk range
    result = result.filter(
      (a) =>
        a.overall_narrative_risk >= riskRange[0] &&
        a.overall_narrative_risk <= riskRange[1]
    );

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "title") {
        comparison = a.page_title.localeCompare(b.page_title);
      } else if (sortField === "overall_risk") {
        comparison = a.overall_narrative_risk - b.overall_narrative_risk;
      } else {
        comparison = a.scores[sortField].score - b.scores[sortField].score;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [articles, filterGroup, search, sortField, sortDirection, riskRange]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Primary Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{primaryStats.count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Baseline Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baselineStats.count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Primary Mean Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roundTo(primaryStats.meanOverallRisk, 2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Median: {roundTo(primaryStats.medianOverallRisk, 2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Baseline Mean Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roundTo(baselineStats.meanOverallRisk, 2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Median: {roundTo(baselineStats.medianOverallRisk, 2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mean per-metric comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mean Metric Scores by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-center">Primary Mean</TableHead>
                <TableHead className="text-center">Baseline Mean</TableHead>
                <TableHead className="text-center">Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {METRIC_KEYS.map((key) => {
                const delta =
                  primaryStats.meanMetrics[key] - baselineStats.meanMetrics[key];
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      {METRIC_LABELS[key]}
                    </TableCell>
                    <TableCell className="text-center">
                      {roundTo(primaryStats.meanMetrics[key], 2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {roundTo(baselineStats.meanMetrics[key], 2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-mono ${
                          delta > 0
                            ? "text-red-500"
                            : delta < 0
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {delta > 0 ? "+" : ""}
                        {roundTo(delta, 2)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <HistogramChart data={histogramData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Divergent Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <DivergenceBarChart data={divergenceData} />
          </CardContent>
        </Card>
      </div>

      {/* Group radar comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Group Mean Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupRadarChart
            primaryData={primaryStats.meanMetrics}
            baselineData={baselineStats.meanMetrics}
          />
        </CardContent>
      </Card>

      {/* All articles table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Articles</CardTitle>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={filterGroup}
              onValueChange={(v) => setFilterGroup(v as FilterGroup)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={`${riskRange[0]}-${riskRange[1]}`}
              onValueChange={(v) => {
                const [min, max] = v.split("-").map(Number);
                setRiskRange([min, max]);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Risk range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5">All (0-5)</SelectItem>
                <SelectItem value="0-2">Low (0-2)</SelectItem>
                <SelectItem value="2-4">Medium (2-4)</SelectItem>
                <SelectItem value="4-5">High (4-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 text-center"
                    onClick={() => handleSort("overall_risk")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Risk
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  {METRIC_KEYS.map((key) => (
                    <TableHead
                      key={key}
                      className="cursor-pointer hover:bg-muted/50 text-center"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {METRIC_LABELS[key].split(" ")[0]}
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.filename}>
                    <TableCell>
                      <Link
                        href={`/articles?title=${encodeURIComponent(
                          slugifyTitle(article.page_title)
                        )}`}
                        className="text-sm hover:underline font-medium"
                      >
                        {article.page_title.replace(/_/g, " ")}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <TypeBadge isBaseline={article.is_baseline} />
                    </TableCell>
                    <TableCell className="text-center">
                      <RiskBadge
                        score={article.overall_narrative_risk}
                        showLabel={false}
                        size="sm"
                      />
                    </TableCell>
                    {METRIC_KEYS.map((key) => (
                      <TableCell key={key} className="text-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {article.scores[key].score.toFixed(1)}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {filteredArticles.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                    >
                      No articles match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
