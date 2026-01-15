import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import {
  Comparison,
  ComparisonSchema,
  SavedComparison,
} from "./types";

// Path to comparisons directory
const COMPARISONS_DIR = path.join(
  process.cwd(),
  "data",
  "interim",
  "comparisons"
);

// Load all comparison definitions
async function loadAllComparisonsUncached(): Promise<SavedComparison[]> {
  try {
    const files = await fs.readdir(COMPARISONS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const comparisons = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const filePath = path.join(COMPARISONS_DIR, file);
          const content = await fs.readFile(filePath, "utf-8");
          const json = JSON.parse(content);
          const parsed = ComparisonSchema.safeParse(json);

          if (!parsed.success) {
            console.warn(`Invalid comparison schema in ${file}`);
            return null;
          }

          // Generate name from filename
          const name = file
            .replace(/\.json$/i, "")
            .replace(/_/g, " ")
            .replace(/ vs /gi, " vs ");

          return {
            id: file.replace(/\.json$/i, ""),
            name,
            primary_page: parsed.data.primary_page,
            baseline_page: parsed.data.baseline_page,
          } as SavedComparison;
        } catch {
          console.warn(`Failed to load comparison ${file}`);
          return null;
        }
      })
    );

    return comparisons.filter((c): c is SavedComparison => c !== null);
  } catch (error) {
    console.error("Failed to read comparisons directory:", error);
    return [];
  }
}

// Cached version
export const loadAllComparisons = cache(loadAllComparisonsUncached);

// Load a single comparison by ID
export async function loadComparisonById(
  id: string
): Promise<SavedComparison | null> {
  const comparisons = await loadAllComparisons();
  return comparisons.find((c) => c.id === id) || null;
}

// Save a new comparison
export async function saveComparison(
  primaryPage: string,
  baselinePage: string
): Promise<SavedComparison> {
  // Create filename from the two page names
  const primaryName = primaryPage.replace(/\.json$/i, "");
  const baselineName = baselinePage.replace(/\.json$/i, "");
  const filename = `${primaryName}_vs_${baselineName}.json`;
  const id = filename.replace(/\.json$/i, "");

  const comparison: Comparison = {
    primary_page: primaryPage.endsWith(".json")
      ? primaryPage
      : `${primaryPage}.json`,
    baseline_page: baselinePage.endsWith(".json")
      ? baselinePage
      : `${baselinePage}.json`,
  };

  const filePath = path.join(COMPARISONS_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(comparison, null, 2), "utf-8");

  return {
    id,
    name: `${primaryName.replace(/_/g, " ")} vs ${baselineName.replace(/_/g, " ")}`,
    primary_page: comparison.primary_page,
    baseline_page: comparison.baseline_page,
  };
}

// Delete a comparison
export async function deleteComparison(id: string): Promise<boolean> {
  try {
    const filename = `${id}.json`;
    const filePath = path.join(COMPARISONS_DIR, filename);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

// Check if comparison exists
export async function comparisonExists(
  primaryPage: string,
  baselinePage: string
): Promise<boolean> {
  const comparisons = await loadAllComparisons();
  const pNorm = primaryPage.replace(/\.json$/i, "").toLowerCase();
  const bNorm = baselinePage.replace(/\.json$/i, "").toLowerCase();

  return comparisons.some((c) => {
    const cPrim = c.primary_page.replace(/\.json$/i, "").toLowerCase();
    const cBase = c.baseline_page.replace(/\.json$/i, "").toLowerCase();
    return cPrim === pNorm && cBase === bNorm;
  });
}
