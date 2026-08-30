import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/AppShell";
import { Panel, PanelHeader, PanelBody } from "@/components/lab/primitives";
import { SentimentBadge } from "@/components/lab/badges";
import { ConfidenceMeter } from "@/components/lab/ConfidenceMeter";
import { ClassProbabilityBars } from "@/components/lab/ConfidenceMeter";
import { FilterSelect } from "@/components/lab/filters";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analysisService } from "@/services/analysisService";
import { MODEL_LABELS } from "@/data/models";
import { percent, ms } from "@/lib/format";
import type { ModelName } from "@/types";

export const Route = createFileRoute("/_app/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze — Sentiment Lab" },
      { name: "description", content: "Run single-text sentiment analysis across available models." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [text, setText] = useState("");
  const [model, setModel] = useState<string>("bert");

  const analyze = useMutation({
    mutationFn: () => analysisService.analyzeText(text, model as ModelName),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Analyze text" subtitle="Run a single-text inference against any available model." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Input" description="Paste or type the text to classify." />
          <PanelBody className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze…"
              className="min-h-40 font-mono text-body-md"
              aria-label="Text to analyze"
            />
            <div className="flex items-center gap-2">
              <FilterSelect
                value={model}
                onChange={setModel}
                label="Model"
                options={Object.entries(MODEL_LABELS).map(([value, label]) => ({ value, label }))}
              />
              <Button onClick={() => analyze.mutate()} disabled={!text.trim() || analyze.isPending}>
                {analyze.isPending ? "Analyzing…" : "Analyze"}
              </Button>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Result" description={analyze.data ? `Inference completed in ${ms(analyze.data.inferenceTimeMs)}` : "Run an analysis to see results."} />
          <PanelBody>
            {analyze.data ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <SentimentBadge sentiment={analyze.data.sentiment} size="md" />
                  <span className="font-mono text-label-md tabular-nums text-on-surface-variant">
                    {percent(analyze.data.confidence)} confidence
                  </span>
                </div>
                <ConfidenceMeter sentiment={analyze.data.sentiment} value={analyze.data.confidence} />
                <ClassProbabilityBars probabilities={analyze.data.probabilities} />
              </div>
            ) : (
              <p className="font-mono text-label-md text-on-surface-variant">No result yet.</p>
            )}
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}
