import { ArticleWithMeta } from "@/lib/types";
import { getOverallRisk } from "@/lib/stats";
import { RiskBadge, TypeBadge } from "@/components/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Calendar } from "lucide-react";

interface ArticleHeaderProps {
  article: ArticleWithMeta;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const formattedDate = new Date(article.analysis_timestamp).toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              {article.page_title.replace(/_/g, " ")}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {article.wiki_language.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge isBaseline={article.is_baseline} />
            <RiskBadge score={getOverallRisk(article)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="text-sm font-medium mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {article.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
