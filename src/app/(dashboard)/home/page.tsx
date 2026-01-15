"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Scale,
  MessageSquare,
  Target,
  Users,
  FileSearch,
  Skull,
  Database,
  Brain,
  BookOpen,
  Cpu,
  FileText
} from "lucide-react";

const metrics = [
  {
    key: "npoV_deviation",
    label: "NPOV Deviation",
    icon: Scale,
    description:
      "Measures departure from Wikipedia's Neutral Point of View policy. High scores indicate the article presents contested claims as settled facts, or frames narratives from a particular viewpoint rather than maintaining editorial neutrality.",
  },
  {
    key: "emotive_language",
    label: "Emotive Language",
    icon: MessageSquare,
    description:
      "Detects dense, high-valence moral language and vivid harm descriptors that create strong emotional responses. Even when attributed, such language creates 'sticky tokens' that models may reproduce without preserving attribution boundaries.",
  },
  {
    key: "certainty_inflation",
    label: "Certainty Inflation",
    icon: Target,
    description:
      "Identifies narrator-voice declaratives that compress legal, scientific, or evidentiary uncertainty into categorical claims. Models trained on this style learn to present contested conclusions as default facts rather than hypotheses.",
  },
  {
    key: "attribution_balance",
    label: "Attribution Balance",
    icon: Users,
    description:
      "Evaluates whether multiple perspectives receive symmetric treatment. Imbalanced attribution stacks institutional voices on one side while summarizing opposition in single clauses, teaching models to weight sources asymmetrically.",
  },
  {
    key: "source_asymmetry",
    label: "Source Asymmetry",
    icon: FileSearch,
    description:
      "Assesses the diversity of the evidentiary ecosystem. Heavy reliance on NGOs, advocacy-aligned commentary, or single epistemic 'lanes' creates monoculture risk where models absorb one narrative as the sole authoritative account.",
  },
  {
    key: "dehumanization_cues",
    label: "Dehumanization Cues",
    icon: Skull,
    description:
      "Flags group-characterization tokens, collective attributions, and essentializing framings. Even when used critically, repeated exposure to such language is a pathway for model contamination into generalized 'group guilt' patterns.",
  },
];

export default function HomePage() {
  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">WikiWarfare</h1>
        <p className="text-xl text-muted-foreground">
          Analyzing narrative risk in Wikipedia articles for AI training safety
        </p>
      </div>

      <Separator />

      {/* The Problem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            The Wikipedia-AI Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Wikipedia is a very important source for training
            nearly every large language model today. From GPT to Gemini to Claude, virtually
            all frontier AI systems ingest Wikipedia as foundational training data.
          </p>
          <p>
            More critically, Wikipedia serves as a <span className="font-bold">truth anchor</span> for
            AI systems. When models encounter conflicting information, Wikipedia's apparent
            neutrality and encyclopedic authority causes it to be weighted as ground truth.
            This makes Wikipedia uniquely powerful in shaping what AI systems believe to be factual.
          </p>
          <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm">
              This creates a critical vulnerability: biased or manipulated Wikipedia articles
              don't just misinform human readers. They systematically embed those biases into
              the AI systems that billions of people rely on for information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* What This Project Does */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            What This Project Does
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            WikiWarfare analyzes Wikipedia articles for <strong>narrative risk</strong>: the
            potential for article content to embed biased, one-sided, or manipulative framings
            into AI training data.
          </p>
          <p>
            We compare <Badge variant="destructive">Primary</Badge> articles (topics of geopolitical
            sensitivity or active information conflict) against <Badge variant="secondary">Baseline</Badge> articles
            (similar topics with more balanced coverage) to identify systematic patterns of
            narrative manipulation.
          </p>
          <p>
            Each article is scored across six dimensions that capture different ways editorial
            choices can bias AI training outcomes. These aren't measures of factual accuracy, they
            measure how article structure and language choices affect what models learn.
          </p>
        </CardContent>
      </Card>

      {/* How Analysis Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            How Analysis Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Each Wikipedia article is analyzed using <strong>GPT-5.2</strong> with a specialized
            evaluation prompt. The complete article text is provided to the model along with
            strict instructions for forensic narrative analysis.
          </p>
          <p>
            Key instructions from the prompt:
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2 text-sm italic text-muted-foreground">
            <p>
              "You are an analytical evaluator of Wikipedia articles with the explicit goal of
              identifying AI training–relevant narrative risk, not general bias criticism or moral judgment."
            </p>
            <p>
              "Think like a compiler or forensic analyst. Be precise, restrained, and literal."
            </p>
          </div>
          <p>
            The model outputs a structured JSON with scores (1-5) for each of the six metrics,
            exact quoted evidence from the article, and brief explanations. Crucially, the prompt
            also requests a separate field:
          </p>
          <div className="p-3 bg-muted rounded-lg font-mono text-sm text-muted-foreground">
            "overall_narrative_risk": &lt;1-5&gt;
          </div>
          <p>
            This overall score is <strong>not</strong> an average of the six metrics. It is an
            independent holistic judgment by the AI, assessing the article's cumulative potential
            to contaminate AI training data. The model weighs all factors together to determine
            how problematic the article would be as training material.
          </p>
        </CardContent>
      </Card>

      {/* Metrics Explanation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">The Six Risk Metrics</h2>
        </div>
        <p className="text-muted-foreground">
          Each metric is scored from 0 (minimal risk) to 5 (severe risk). Higher scores
          indicate greater potential for the article to embed problematic patterns into
          AI training.
        </p>

        <div className="grid gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Overall Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Narrative Risk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The <strong>Overall Narrative Risk</strong> score (0-5) represents the aggregate
            potential for an article to contaminate AI training with biased framings. Articles
            scoring 4-5 represent extreme cases where contested characterizations are encoded
            as settled facts, creating systematic bias in any model trained on the content.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-500 text-white">0-1: Low Risk</Badge>
            <Badge className="bg-lime-500 text-white">1-2: Moderate</Badge>
            <Badge className="bg-yellow-500 text-white">2-3: Elevated</Badge>
            <Badge className="bg-orange-500 text-white">3-4: High</Badge>
            <Badge className="bg-red-500 text-white">4-5: Severe</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Navigation hint */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        Use the navigation above to explore individual articles, compare pairs, or view aggregate statistics.
      </div>
    </div>
  );
}
