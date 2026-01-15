"use client";

import { useState, useEffect, useCallback } from "react";
import { SavedComparison } from "@/lib/types";
import { getStaticComparisons } from "@/lib/static-data";

const STORAGE_KEY = "wikiwarefare-comparisons";

export function useComparisons() {
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load comparisons from localStorage on mount
  useEffect(() => {
    const staticComparisons = getStaticComparisons();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userComparisons = JSON.parse(stored) as SavedComparison[];
        // Merge static and user comparisons, user comparisons take precedence
        const merged = [...staticComparisons];
        for (const userComp of userComparisons) {
          if (!merged.some((c) => c.id === userComp.id)) {
            merged.push(userComp);
          }
        }
        setComparisons(merged);
      } else {
        setComparisons(staticComparisons);
      }
    } catch {
      setComparisons(staticComparisons);
    }
    setIsLoaded(true);
  }, []);

  const saveComparison = useCallback(
    (primaryPage: string, baselinePage: string): SavedComparison => {
      const primaryName = primaryPage.replace(/\.json$/i, "");
      const baselineName = baselinePage.replace(/\.json$/i, "");
      const id = `${primaryName}_vs_${baselineName}`;

      const newComparison: SavedComparison = {
        id,
        name: `${primaryName.replace(/_/g, " ")} vs ${baselineName.replace(/_/g, " ")}`,
        primary_page: primaryPage.endsWith(".json") ? primaryPage : `${primaryPage}.json`,
        baseline_page: baselinePage.endsWith(".json") ? baselinePage : `${baselinePage}.json`,
      };

      setComparisons((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        updated.push(newComparison);

        // Save only user-added comparisons to localStorage
        const staticIds = new Set(getStaticComparisons().map((c) => c.id));
        const userComparisons = updated.filter((c) => !staticIds.has(c.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userComparisons));

        return updated;
      });

      return newComparison;
    },
    []
  );

  const deleteComparison = useCallback((id: string): boolean => {
    const staticIds = new Set(getStaticComparisons().map((c) => c.id));

    // Don't allow deleting static comparisons
    if (staticIds.has(id)) {
      return false;
    }

    setComparisons((prev) => {
      const updated = prev.filter((c) => c.id !== id);

      // Save only user-added comparisons to localStorage
      const userComparisons = updated.filter((c) => !staticIds.has(c.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userComparisons));

      return updated;
    });

    return true;
  }, []);

  return {
    comparisons,
    isLoaded,
    saveComparison,
    deleteComparison,
  };
}
