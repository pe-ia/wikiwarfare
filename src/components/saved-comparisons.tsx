"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SavedComparison, ArticleWithMeta } from "@/lib/types";
import { Bookmark, ChevronDown, Trash2, Plus } from "lucide-react";
import { ArticleSelector } from "@/components/article-selector";
import { getStaticComparisons } from "@/lib/static-data";

interface SavedComparisonsProps {
  comparisons: SavedComparison[];
  articles: ArticleWithMeta[];
  currentA?: string;
  currentB?: string;
  onSaveComparison?: (primaryPage: string, baselinePage: string) => void;
  onDeleteComparison?: (id: string) => boolean;
}

export function SavedComparisons({
  comparisons,
  articles,
  currentA,
  currentB,
  onSaveComparison,
  onDeleteComparison,
}: SavedComparisonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPrimary, setNewPrimary] = useState(currentA ?? "");
  const [newBaseline, setNewBaseline] = useState(currentB ?? "");

  // Check if a comparison is from the static data (can't be deleted)
  const staticIds = new Set(getStaticComparisons().map((c) => c.id));

  const handleSelect = (comparison: SavedComparison) => {
    const a = comparison.primary_page.replace(/\.json$/i, "");
    const b = comparison.baseline_page.replace(/\.json$/i, "");
    startTransition(() => {
      router.push(`/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
    });
  };

  const handleDelete = (id: string) => {
    if (onDeleteComparison) {
      onDeleteComparison(id);
    }
    setDeleteId(null);
  };

  const handleSave = () => {
    if (!newPrimary || !newBaseline) return;

    if (onSaveComparison) {
      onSaveComparison(newPrimary, newBaseline);
    }
    setShowSaveDialog(false);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Comparisons
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          {comparisons.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No saved comparisons
            </div>
          ) : (
            comparisons.map((comparison) => (
              <DropdownMenuItem
                key={comparison.id}
                className="flex items-center justify-between cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  handleSelect(comparison);
                }}
              >
                <span className="text-sm truncate flex-1">{comparison.name}</span>
                {!staticIds.has(comparison.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(comparison.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setNewPrimary(currentA ?? "");
              setNewBaseline(currentB ?? "");
              setShowSaveDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Save Current Comparison
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comparison</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this saved comparison? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Comparison</DialogTitle>
            <DialogDescription>
              Save this comparison for quick access later (stored in browser).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <ArticleSelector
              articles={articles}
              value={newPrimary}
              onChange={setNewPrimary}
              label="Primary Article"
              excludeTitle={newBaseline}
            />
            <ArticleSelector
              articles={articles}
              value={newBaseline}
              onChange={setNewBaseline}
              label="Baseline Article"
              excludeTitle={newPrimary}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!newPrimary || !newBaseline}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
