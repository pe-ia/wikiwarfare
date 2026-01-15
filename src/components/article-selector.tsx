"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArticleWithMeta } from "@/lib/types";
import { slugifyTitle } from "@/lib/baselines";

interface ArticleSelectorProps {
  articles: ArticleWithMeta[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  excludeTitle?: string;
}

export function ArticleSelector({
  articles,
  value,
  onChange,
  label,
  excludeTitle,
}: ArticleSelectorProps) {
  const baselines = articles.filter(
    (a) => a.is_baseline && slugifyTitle(a.page_title) !== excludeTitle
  );
  const primaries = articles.filter(
    (a) => !a.is_baseline && slugifyTitle(a.page_title) !== excludeTitle
  );

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an article" />
        </SelectTrigger>
        <SelectContent>
          {primaries.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Primary
              </div>
              {primaries.map((article) => (
                <SelectItem
                  key={article.filename}
                  value={slugifyTitle(article.page_title)}
                >
                  {article.page_title.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </>
          )}
          {baselines.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Baseline
              </div>
              {baselines.map((article) => (
                <SelectItem
                  key={article.filename}
                  value={slugifyTitle(article.page_title)}
                >
                  {article.page_title.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
