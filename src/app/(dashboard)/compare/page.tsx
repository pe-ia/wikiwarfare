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

  return (
    <CompareView
      articles={articles}
      savedComparisons={comparisons}
      initialA="Euromaidan"
      initialB="2011_Egyptian_revolution"
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
