import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import {
  ArticleSchema,
  ArticleWithMeta,
} from "./types";
import { loadAllComparisons } from "./fs-comparisons";

// Path to wiki data directory
const WIKI_DATA_DIR = path.join(process.cwd(), "data", "raw", "wiki");

// Warnings storage for skipped files
let loadWarnings: string[] = [];

export function getLoadWarnings(): string[] {
  return loadWarnings;
}

export function clearLoadWarnings(): void {
  loadWarnings = [];
}

// Load a single article JSON file
async function loadArticleFile(
  filePath: string,
  baselineFilenames: Set<string>
): Promise<ArticleWithMeta | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(content);
    const parsed = ArticleSchema.safeParse(json);

    if (!parsed.success) {
      const filename = path.basename(filePath);
      loadWarnings.push(`Invalid schema in ${filename}: ${parsed.error.message}`);
      return null;
    }

    const filename = path.basename(filePath);

    // Clean up the article data - trim whitespace from page_title
    const articleData = {
      ...parsed.data,
      page_title: parsed.data.page_title.trim(),
    };

    return {
      ...articleData,
      filename,
      is_baseline: baselineFilenames.has(filename.toLowerCase()),
    };
  } catch (error) {
    const filename = path.basename(filePath);
    loadWarnings.push(
      `Failed to load ${filename}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return null;
  }
}

// Load all article files from the wiki directory
async function loadAllArticlesUncached(): Promise<ArticleWithMeta[]> {
  clearLoadWarnings();

  try {
    // Derive baseline filenames from comparison data
    const comparisons = await loadAllComparisons();
    const baselineFilenames = new Set(
      comparisons.map((c) => c.baseline_page.toLowerCase())
    );

    const files = await fs.readdir(WIKI_DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const articles = await Promise.all(
      jsonFiles.map((file) =>
        loadArticleFile(path.join(WIKI_DATA_DIR, file), baselineFilenames)
      )
    );

    return articles.filter((a): a is ArticleWithMeta => a !== null);
  } catch (error) {
    loadWarnings.push(
      `Failed to read wiki directory: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return [];
  }
}

// Cached version using React cache
export const loadAllArticles = cache(loadAllArticlesUncached);

// Load a single article by title
export async function loadArticleByTitle(
  title: string
): Promise<ArticleWithMeta | null> {
  const articles = await loadAllArticles();

  // Try exact filename match first
  const byFilename = articles.find(
    (a) =>
      a.filename.replace(/\.json$/i, "").toLowerCase() === title.toLowerCase() ||
      a.filename.toLowerCase() === title.toLowerCase() ||
      a.filename.toLowerCase() === `${title.toLowerCase()}.json`
  );
  if (byFilename) return byFilename;

  // Try page_title match
  const byTitle = articles.find(
    (a) =>
      a.page_title.toLowerCase() === title.toLowerCase() ||
      a.page_title.replace(/_/g, " ").toLowerCase() ===
        title.replace(/_/g, " ").toLowerCase()
  );
  if (byTitle) return byTitle;

  return null;
}

// Get articles grouped by baseline status
export async function getGroupedArticles(): Promise<{
  baselines: ArticleWithMeta[];
  primaries: ArticleWithMeta[];
}> {
  const articles = await loadAllArticles();

  const baselines = articles.filter((a) => a.is_baseline);
  const primaries = articles.filter((a) => !a.is_baseline);

  return { baselines, primaries };
}

// Get all article titles
export async function getAllTitles(): Promise<string[]> {
  const articles = await loadAllArticles();
  return articles.map((a) => a.page_title);
}
