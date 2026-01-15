"use client";

import { getStaticArticles } from "@/lib/static-data";
import { StatsView } from "@/components/stats-view";

export default function StatsPage() {
  const articles = getStaticArticles();

  return <StatsView articles={articles} />;
}
