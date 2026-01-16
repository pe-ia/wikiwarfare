"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getStaticArticles, getStaticArticleByTitle } from "@/lib/static-data";
import { ArticleWithMeta } from "@/lib/types";
import { ArticleSidebar } from "@/components/article-sidebar";
import { ArticleDetail } from "@/components/article-detail";
import {
  ArticleSidebarSkeleton,
  ArticleDetailSkeleton,
} from "@/components/skeletons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, List } from "lucide-react";

function ArticlesContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [articles, setArticles] = useState<ArticleWithMeta[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const allArticles = getStaticArticles();
    setArticles(allArticles);

    // Find selected article
    let article: ArticleWithMeta | undefined;

    if (title) {
      article = getStaticArticleByTitle(title);
    }

    // Default to Euromaidan or first primary
    if (!article) {
      article = getStaticArticleByTitle("Euromaidan");
    }
    if (!article) {
      const primaries = allArticles.filter((a) => !a.is_baseline);
      article = primaries[0] ?? allArticles[0];
    }

    setSelectedArticle(article ?? null);
    setIsLoading(false);
  }, [title]);

  // When article changes (user selected from sidebar), hide sidebar on mobile
  useEffect(() => {
    setShowSidebar(false);
  }, [title]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] px-4">
        <div className="hidden md:block">
          <ArticleSidebarSkeleton />
        </div>
        <ArticleDetailSkeleton />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No articles found</AlertTitle>
          <AlertDescription>
            Could not load any articles. Please check that the static data was generated.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] px-4">
      {/* Desktop: always show sidebar */}
      <div className="hidden md:block">
        <ArticleSidebar articles={articles} />
      </div>

      {/* Mobile: show sidebar OR article */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        {showSidebar ? (
          <ArticleSidebar articles={articles} />
        ) : (
          <>
            {/* Button to show article list */}
            <div className="p-2 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="w-full"
              >
                <List className="h-4 w-4 mr-2" />
                Select Article
              </Button>
            </div>
            {selectedArticle ? (
              <ArticleDetail article={selectedArticle} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Article not found. Please select an article.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop: article detail */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden">
        {selectedArticle ? (
          <ArticleDetail article={selectedArticle} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              Article not found. Please select an article from the sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] px-4">
          <div className="hidden md:block">
            <ArticleSidebarSkeleton />
          </div>
          <ArticleDetailSkeleton />
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  );
}
