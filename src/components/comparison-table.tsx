"use client";

import { ArticleWithMeta, METRIC_KEYS, METRIC_LABELS } from "@/lib/types";
import { metricArray, roundTo } from "@/lib/stats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RiskBadge } from "@/components/risk-badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface ComparisonTableProps {
  articleA: ArticleWithMeta;
  articleB: ArticleWithMeta;
}

export function ComparisonTable({ articleA, articleB }: ComparisonTableProps) {
  const metricsA = metricArray(articleA);
  const metricsB = metricArray(articleB);

  // Delta = A - B (primary - baseline)
  // Positive = primary is higher (worse) = red/up
  // Negative = primary is lower (better) = green/down
  const getDeltaIndicator = (delta: number) => {
    if (Math.abs(delta) < 0.1) {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
    if (delta > 0) {
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    }
    return <ArrowDown className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Metric</TableHead>
            <TableHead className="text-center w-[100px]">Delta</TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-center">
              {articleA.page_title.replace(/_/g, " ").substring(0, 25)}
              {articleA.page_title.length > 25 ? "..." : ""}
            </TableHead>
            <TableHead className="text-center">
              {articleB.page_title.replace(/_/g, " ").substring(0, 25)}
              {articleB.page_title.length > 25 ? "..." : ""}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {METRIC_KEYS.map((key, index) => {
            const metricA = metricsA[index];
            const metricB = metricsB[index];
            // Delta = A - B (how much higher primary is than baseline)
            const delta = metricA.score - metricB.score;

            return (
              <TableRow key={key}>
                <TableCell className="font-medium">{METRIC_LABELS[key]}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-mono text-sm ${
                      delta > 0
                        ? "text-red-500"
                        : delta < 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {delta > 0 ? "+" : ""}
                    {roundTo(delta, 1)}
                  </span>
                </TableCell>
                <TableCell>{getDeltaIndicator(delta)}</TableCell>
                <TableCell className="text-center">
                  <RiskBadge score={metricA.score} showLabel={false} size="sm" />
                </TableCell>
                <TableCell className="text-center">
                  <RiskBadge score={metricB.score} showLabel={false} size="sm" />
                </TableCell>
              </TableRow>
            );
          })}
          {/* Overall row */}
          <TableRow className="font-semibold bg-muted/50">
            <TableCell>Overall Narrative Risk</TableCell>
            <TableCell className="text-center">
              {(() => {
                const delta =
                  articleA.overall_narrative_risk - articleB.overall_narrative_risk;
                return (
                  <span
                    className={`font-mono text-sm ${
                      delta > 0
                        ? "text-red-500"
                        : delta < 0
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {delta > 0 ? "+" : ""}
                    {roundTo(delta, 1)}
                  </span>
                );
              })()}
            </TableCell>
            <TableCell>
              {getDeltaIndicator(
                articleA.overall_narrative_risk - articleB.overall_narrative_risk
              )}
            </TableCell>
            <TableCell className="text-center">
              <RiskBadge
                score={articleA.overall_narrative_risk}
                showLabel={false}
                size="sm"
              />
            </TableCell>
            <TableCell className="text-center">
              <RiskBadge
                score={articleB.overall_narrative_risk}
                showLabel={false}
                size="sm"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Expandable details per metric */}
      <Accordion type="multiple" className="w-full">
        {METRIC_KEYS.map((key, index) => {
          const metricA = metricsA[index];
          const metricB = metricsB[index];

          return (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-sm">
                {METRIC_LABELS[key]} Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Article A */}
                  <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                    <h4 className="font-medium text-sm">
                      {articleA.page_title.replace(/_/g, " ")}
                    </h4>
                    <div>
                      <h5 className="text-xs font-medium mb-1">Explanation</h5>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {metricA.explanation}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium mb-1">Evidence</h5>
                      <ul className="space-y-1">
                        {metricA.evidence.map((quote, i) => (
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

                  {/* Article B */}
                  <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                    <h4 className="font-medium text-sm">
                      {articleB.page_title.replace(/_/g, " ")}
                    </h4>
                    <div>
                      <h5 className="text-xs font-medium mb-1">Explanation</h5>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {metricB.explanation}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium mb-1">Evidence</h5>
                      <ul className="space-y-1">
                        {metricB.evidence.map((quote, i) => (
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
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
