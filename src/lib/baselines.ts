// Baseline detection configuration
// Articles in this list are considered "baseline" (neutral comparators)
// All others are considered "primary" (articles of interest)

export const BASELINE_TITLES: string[] = [
  "NATO_bombing_of_Yugoslavia",
  "Battle_of_Mosul_(2016–2017)",
  "India–Pakistan_war_of_1947–1948",
  "Irish_nationalism",
  "Enlargement_of_the_European_Union",
  "Turkey",
  "Iraqi_invasion_of_Kuwait",
  "Iran–Iraq_War",
  "2011_Egyptian_revolution",
  "French_Foreign_Legion",
];

// Normalize title for comparison (remove extension, handle special chars)
export function normalizeTitle(title: string): string {
  return title
    .replace(/\.json$/i, "")
    .replace(/_/g, " ")
    .trim();
}

// Slugify title for URL use
export function slugifyTitle(title: string): string {
  return title
    .trim()
    .replace(/\.json$/i, "")
    .replace(/\s+/g, "_")
    .replace(/_+$/, ""); // Remove trailing underscores
}

// Extract title from filename
export function titleFromFilename(filename: string): string {
  return filename.replace(/\.json$/i, "");
}

// Check if a title is a baseline article
export function isBaseline(title: string): boolean {
  const normalized = titleFromFilename(title);
  return BASELINE_TITLES.some(
    (baselineTitle) =>
      baselineTitle.toLowerCase() === normalized.toLowerCase()
  );
}

// Find article by title (case-insensitive)
export function findByTitle<T extends { page_title: string }>(
  articles: T[],
  title: string
): T | undefined {
  const searchTitle = normalizeTitle(title).toLowerCase();
  return articles.find(
    (article) =>
      normalizeTitle(article.page_title).toLowerCase() === searchTitle ||
      article.page_title.toLowerCase() === title.toLowerCase() ||
      slugifyTitle(article.page_title).toLowerCase() === title.toLowerCase()
  );
}

// Find article by filename
export function findByFilename<T extends { filename: string }>(
  articles: T[],
  filename: string
): T | undefined {
  const searchFilename = filename.replace(/\.json$/i, "");
  return articles.find(
    (article) =>
      article.filename.replace(/\.json$/i, "").toLowerCase() ===
      searchFilename.toLowerCase()
  );
}
