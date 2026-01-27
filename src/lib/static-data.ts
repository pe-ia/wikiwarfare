import staticData from "@/data/static-data.json";
import { ArticleWithMeta, SavedComparison } from "./types";

// Type assertion for the imported data
const data = staticData as {
  articles: ArticleWithMeta[];
  comparisons: SavedComparison[];
};

export function getStaticArticles(): ArticleWithMeta[] {
  return data.articles;
}

export function getStaticComparisons(): SavedComparison[] {
  return data.comparisons;
}

export function getStaticArticleByTitle(title: string): ArticleWithMeta | undefined {
  const searchTitle = title.toLowerCase().replace(/_/g, " ");

  return data.articles.find((article) => {
    const articleTitle = article.page_title.toLowerCase().replace(/_/g, " ");
    const filenameTitle = article.filename.replace(/\.json$/i, "").toLowerCase().replace(/_/g, " ");

    return (
      articleTitle === searchTitle ||
      filenameTitle === searchTitle ||
      article.filename.replace(/\.json$/i, "").toLowerCase() === title.toLowerCase()
    );
  });
}
