"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ArticleWithMeta, SavedComparison } from "@/lib/types";
import { metricArray } from "@/lib/stats";
import { slugifyTitle, findByTitle } from "@/lib/baselines";
import { ArticleSelector } from "@/components/article-selector";
import { ComparisonTable } from "@/components/comparison-table";
import { SavedComparisons } from "@/components/saved-comparisons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge, TypeBadge } from "@/components/risk-badge";
import { CompareRadarChart } from "@/components/charts/radar-chart";
import { DeltaBarChart } from "@/components/charts/bar-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Globe } from "lucide-react";

interface CompareViewProps {
  articles: ArticleWithMeta[];
  savedComparisons: SavedComparison[];
  initialA: string;
  initialB: string;
  onSaveComparison?: (primaryPage: string, baselinePage: string) => void;
  onDeleteComparison?: (id: string) => boolean;
}

export function CompareView({
  articles,
  savedComparisons,
  initialA,
  initialB,
  onSaveComparison,
  onDeleteComparison,
}: CompareViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentA = searchParams.get("a") ?? initialA;
  const currentB = searchParams.get("b") ?? initialB;

  const articleA = findByTitle(articles, currentA);
  const articleB = findByTitle(articles, currentB);

  const handleChangeA = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("a", value);
      router.push(`/compare?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleChangeB = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("b", value);
      router.push(`/compare?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (!articleA || !articleB) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">
            One or both articles not found. Please select valid articles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
            <ArticleSelector
              articles={articles}
              value={currentA}
              onChange={handleChangeA}
              label="Article A"
              excludeTitle={currentB}
            />
            <ArticleSelector
              articles={articles}
              value={currentB}
              onChange={handleChangeB}
              label="Article B"
              excludeTitle={currentA}
            />
          </div>
        </div>
      </div>
    );
  }

  const metricsA = metricArray(articleA);
  const metricsB = metricArray(articleB);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header with selectors */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 max-w-xl">
          <ArticleSelector
            articles={articles}
            value={slugifyTitle(articleA.page_title)}
            onChange={handleChangeA}
            label="Article A"
            excludeTitle={slugifyTitle(articleB.page_title)}
          />
          <ArticleSelector
            articles={articles}
            value={slugifyTitle(articleB.page_title)}
            onChange={handleChangeB}
            label="Article B"
            excludeTitle={slugifyTitle(articleA.page_title)}
          />
        </div>
        <SavedComparisons
          comparisons={savedComparisons}
          articles={articles}
          currentA={slugifyTitle(articleA.page_title)}
          currentB={slugifyTitle(articleB.page_title)}
          onSaveComparison={onSaveComparison}
          onDeleteComparison={onDeleteComparison}
        />
      </div>

      {/* Side-by-side summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[articleA, articleB].map((article, i) => (
          <Card key={article.filename}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  {article.page_title.replace(/_/g, " ")}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <TypeBadge isBaseline={article.is_baseline} />
                  <RiskBadge score={article.overall_narrative_risk} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {article.wiki_language.toUpperCase()}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.analysis_timestamp)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {article.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metric Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonTable articleA={articleA} articleB={articleB} />
        </CardContent>
      </Card>

      {/* Charts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Visualizations</h3>
        <Tabs defaultValue="radar" className="w-full">
          <TabsList>
            <TabsTrigger value="radar">Overlaid Radar</TabsTrigger>
            <TabsTrigger value="delta">Delta Bar Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="radar">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Score Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <CompareRadarChart
                  dataA={metricsA}
                  dataB={metricsB}
                  labelA={articleA.page_title.replace(/_/g, " ").substring(0, 25)}
                  labelB={articleB.page_title.replace(/_/g, " ").substring(0, 25)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="delta">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Score Delta (A - B)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeltaBarChart
                  dataA={metricsA}
                  dataB={metricsB}
                  labelA={articleA.page_title.replace(/_/g, " ").substring(0, 20)}
                  labelB={articleB.page_title.replace(/_/g, " ").substring(0, 20)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
