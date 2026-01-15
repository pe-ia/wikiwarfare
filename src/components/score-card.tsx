"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MetricInfo } from "@/lib/types";
import { getRiskColor } from "@/lib/stats";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  metric: MetricInfo;
}

export function ScoreCard({ metric }: ScoreCardProps) {
  const colorClass = getRiskColor(metric.score);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
          <div
            className={cn(
              "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white",
              colorClass
            )}
          >
            {metric.score.toFixed(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline py-2">
              View Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium mb-1">Explanation</h4>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {metric.explanation}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1">Evidence</h4>
                  <ul className="space-y-1">
                    {metric.evidence.map((quote, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground pl-3 border-l-2 border-muted"
                      >
                        <span className="italic">&ldquo;{quote}&rdquo;</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

interface ScoreCardGridProps {
  metrics: MetricInfo[];
}

export function ScoreCardGrid({ metrics }: ScoreCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <ScoreCard key={metric.key} metric={metric} />
      ))}
    </div>
  );
}
