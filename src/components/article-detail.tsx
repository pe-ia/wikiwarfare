"use client";

import { ArticleWithMeta } from "@/lib/types";
import { metricArray } from "@/lib/stats";
import { ArticleHeader } from "@/components/article-header";
import { ScoreCardGrid } from "@/components/score-card";
import { JsonViewer } from "@/components/json-viewer";
import { SingleRadarChart } from "@/components/charts/radar-chart";
import { SingleBarChart } from "@/components/charts/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ArticleDetailProps {
  article: ArticleWithMeta;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const metrics = metricArray(article);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <ArticleHeader article={article} />

      {/* Score Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Metric Scores</h3>
        <ScoreCardGrid metrics={metrics} />
      </div>

      {/* Charts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Visualizations</h3>
        <Tabs defaultValue="radar" className="w-full">
          <TabsList>
            <TabsTrigger value="radar">Radar Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="radar">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Metric Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <SingleRadarChart data={metrics} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bar">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Metric Score Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <SingleBarChart data={metrics} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Raw JSON */}
      <JsonViewer article={article} />
    </div>
  );
}
