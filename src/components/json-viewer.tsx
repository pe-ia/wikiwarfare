"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Copy, Check } from "lucide-react";
import { ArticleWithMeta } from "@/lib/types";

interface JsonViewerProps {
  article: ArticleWithMeta;
}

export function JsonViewer({ article }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  // Remove the computed fields for display
  const { filename, is_baseline, ...rawData } = article;

  const jsonString = JSON.stringify(rawData, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="json">
        <AccordionTrigger className="text-sm">Raw JSON</AccordionTrigger>
        <AccordionContent>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">
              <code>{jsonString}</code>
            </pre>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
