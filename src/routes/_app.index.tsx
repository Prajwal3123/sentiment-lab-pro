import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Database,
  FlaskConical,
  Percent,
} from "lucide-react";
import { MetricCard } from "@/components/lab/MetricCard";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PageHeader,
  SectionLabel,
} from "@/components/layout/AppShell";
import { SentimentDonut } from "@/components/charts/SentimentDonut";
import { SentimentTrendChart } from "@/components/charts/SentimentTrendChart";
import { DataTable } from "@/components/lab/DataTable";
import { SentimentBadge } from "@/components/lab/badges";
import { ModelBadge } from "@/components/lab/badges";
import { compactNumber, formatDate, percent } from "@/lib/format";
import type { Prediction } from "@/types";
import {
  analyticsService,
  datasetService,
  historyService,
  modelService,
} from "@/services";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sentiment Analysis Lab" },
      {
        name: "description",
        content: "Research overview: prediction volume, sentiment distribution, and model health.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const analytics = useQuery({ queryKey: ["analytics"], queryFn: () => analyticsService.getAnalytics() });
  const models = useQuery({ queryKey: ["models"], queryFn: () => modelService.getModels() });
  const datasets = useQuery({ queryKey: ["datasets"], queryFn: () => datasetService.getDatasets() });
  const recent = useQuery({ queryKey: ["recent-predictions"], queryFn: () => historyService.getRecentPredictions(6) });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research overview"
        subtitle="Prediction volume, sentiment distribution, and model health at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total predictions"
          value={compactNumber(analytics.data?.totalPredictions ?? 0)}
          icon={Activity}
          hint="Across all models"
        />
        <MetricCard
          label="Best model accuracy"
          value={percent(analytics.data?.bestModelAccuracy ?? 0)}
          icon={Percent}
          tone="positive"
          hint="Holdout evaluation"
        />
        <MetricCard
          label="Datasets"
          value={String(datasets.data?.length ?? 0)}
          icon={Database}
          hint="In the workspace"
        />
        <MetricCard
          label="Models"
          value={String(models.data?.length ?? 0)}
          icon={FlaskConical}
          hint="Trained & available"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Sentiment distribution" description="Share of predicted classes over the selected window." />
          <PanelBody>
            {analytics.data ? (
              <SentimentDonut data={analytics.data.distribution} />
            ) : (
              <LoadingFallback />
            )}
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader title="Prediction volume" description="Daily volume across all models." />
          <PanelBody>
            {analytics.data ? (
              <SentimentTrendChart data={analytics.data.trend} />
            ) : (
              <LoadingFallback />
            )}
          </PanelBody>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Recent predictions" description="Latest inference requests across all models." />
        <PanelBody className="p-0">
          <DataTable<Prediction>
            rows={recent.data ?? []}
            rowKey={(row) => row.id}
            columns={[
              { key: "text", header: "Input text", cell: (row) => <span className="line-clamp-1 max-w-md">{row.text}</span> },
              { key: "model", header: "Model", cell: (row) => <ModelBadge model={row.model} /> },
              {
                key: "sentiment",
                header: "Sentiment",
                cell: (row) => <SentimentBadge sentiment={row.sentiment} />,
              },
              {
                key: "confidence",
                header: "Confidence",
                align: "right",
                cell: (row) => <span className="font-mono tabular-nums">{percent(row.confidence)}</span>,
              },
              {
                key: "date",
                header: "Time",
                align: "right",
                hideBelow: "md",
                cell: (row) => <span className="text-on-surface-variant">{formatDate(row.createdAt)}</span>,
              },
            ]}
          />
        </PanelBody>
      </Panel>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <span className="font-mono text-label-md text-on-surface-variant">Loading chart data…</span>
    </div>
  );
}
