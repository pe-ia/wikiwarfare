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

// Decode percent-encoded characters (e.g. %27 → ')
function decodePct(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// Find article by title (case-insensitive)
export function findByTitle<T extends { page_title: string }>(
  articles: T[],
  title: string
): T | undefined {
  const searchTitle = normalizeTitle(title).toLowerCase();
  const decodedTitle = decodePct(title);
  const decodedSearch = normalizeTitle(decodedTitle).toLowerCase();
  return articles.find(
    (article) => {
      const norm = normalizeTitle(article.page_title).toLowerCase();
      const lower = article.page_title.toLowerCase();
      const slug = slugifyTitle(article.page_title).toLowerCase();
      return (
        norm === searchTitle ||
        norm === decodedSearch ||
        lower === title.toLowerCase() ||
        lower === decodedTitle.toLowerCase() ||
        slug === title.toLowerCase() ||
        slug === decodedTitle.toLowerCase()
      );
    }
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
