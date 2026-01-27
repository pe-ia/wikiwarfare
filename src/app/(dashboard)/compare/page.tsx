"use client";

import { Suspense } from "react";
import { getStaticArticles } from "@/lib/static-data";
import { useComparisons } from "@/hooks/use-comparisons";
import { CompareView } from "@/components/compare-view";
import { CompareSkeleton } from "@/components/skeletons";

function CompareContent() {
  const articles = getStaticArticles();
  const { comparisons, isLoaded, saveComparison, deleteComparison } = useComparisons();

  if (!isLoaded) {
    return <CompareSkeleton />;
  }

  const defaultA = articles.find((a) => a.page_title === "Euromaidan")?.page_title
    ?? articles.find((a) => !a.is_baseline)?.page_title
    ?? articles[0]?.page_title ?? "";
  const defaultB = articles.find((a) => a.page_title === "2011 Egyptian revolution")?.page_title
    ?? articles.find((a) => a.is_baseline)?.page_title
    ?? articles[1]?.page_title ?? "";

  return (
    <CompareView
      articles={articles}
      savedComparisons={comparisons}
      initialA={defaultA}
      initialB={defaultB}
      onSaveComparison={saveComparison}
      onDeleteComparison={deleteComparison}
    />
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
