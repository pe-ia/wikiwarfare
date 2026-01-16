"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArticleWithMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { slugifyTitle } from "@/lib/baselines";
import { Search } from "lucide-react";

interface ArticleSidebarProps {
  articles: ArticleWithMeta[];
}

export function ArticleSidebar({ articles }: ArticleSidebarProps) {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const currentTitle = searchParams.get("title") ?? "";

  const grouped = useMemo(() => {
    const baselines = articles.filter((a) => a.is_baseline);
    const primaries = articles.filter((a) => !a.is_baseline);
    return { baselines, primaries };
  }, [articles]);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return {
      baselines: grouped.baselines.filter((a) =>
        a.page_title.toLowerCase().includes(searchLower)
      ),
      primaries: grouped.primaries.filter((a) =>
        a.page_title.toLowerCase().includes(searchLower)
      ),
    };
  }, [grouped, search]);

  const isSelected = (article: ArticleWithMeta) => {
    return (
      slugifyTitle(article.page_title).toLowerCase() ===
        currentTitle.toLowerCase() ||
      article.page_title.toLowerCase() === currentTitle.toLowerCase() ||
      article.filename.replace(/\.json$/i, "").toLowerCase() ===
        currentTitle.toLowerCase()
    );
  };

  return (
    <div className="w-full md:w-72 border-r bg-background flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Primary Articles */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold">Primary</h3>
              <Badge variant="destructive" className="text-xs">
                {filtered.primaries.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {filtered.primaries.map((article) => (
                <Link
                  key={article.filename}
                  href={`/articles?title=${encodeURIComponent(
                    slugifyTitle(article.page_title)
                  )}`}
                  className={cn(
                    "block text-sm px-2 py-1.5 rounded-md truncate transition-colors",
                    isSelected(article)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  title={article.page_title.replace(/_/g, " ")}
                >
                  {article.page_title.replace(/_/g, " ")}
                </Link>
              ))}
              {filtered.primaries.length === 0 && (
                <p className="text-xs text-muted-foreground px-2">
                  No matching articles
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Baseline Articles */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold">Baseline</h3>
              <Badge variant="secondary" className="text-xs">
                {filtered.baselines.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {filtered.baselines.map((article) => (
                <Link
                  key={article.filename}
                  href={`/articles?title=${encodeURIComponent(
                    slugifyTitle(article.page_title)
                  )}`}
                  className={cn(
                    "block text-sm px-2 py-1.5 rounded-md truncate transition-colors",
                    isSelected(article)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  title={article.page_title.replace(/_/g, " ")}
                >
                  {article.page_title.replace(/_/g, " ")}
                </Link>
              ))}
              {filtered.baselines.length === 0 && (
                <p className="text-xs text-muted-foreground px-2">
                  No matching articles
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
