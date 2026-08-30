import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Percent, Sparkles, Target, Timer } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Panel, PanelHeader, PanelBody } from "@/components/lab/primitives";
import { MetricCard } from "@/components/lab/MetricCard";
import { StatusBadge } from "@/components/lab/badges";
import { ModelBadge } from "@/components/lab/badges";
import { SentimentDonut } from "@/components/charts/SentimentDonut";
import { SentimentTrendChart } from "@/components/charts/SentimentTrendChart";
import { MetricGroupedBarChart, METRIC_SERIES } from "@/components/charts/MetricGroupedBarChart";
import { DataTable } from "@/components/lab/DataTable";
import { analyticsService } from "@/services/analyticsService";
import { modelService } from "@/services/modelService";
import { historyService } from "@/services/historyService";
import { datasetService } from "@/services/datasetService";
import { percent } from "@/lib/format";
import type { Prediction } from "@/types";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sentiment Lab" },
      { name: "description", content: "Prediction volume, sentiment distribution, and model health at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const analytics = useQuery({ queryKey: ["analytics"], queryFn: analyticsService.getAnalytics });
  const models = useQuery({ queryKey: ["models"], queryFn: modelService.getModels });
  const datasets = useQuery({ queryKey: ["datasets"], queryFn: datasetService.getDatasets });
  const recent = useQuery({ queryKey: ["recent-predictions"], queryFn: () => historyService.getRecentPredictions(6) });

  const readyModels = models.data?.filter((m) => m.status === "ready").length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Prediction volume, sentiment distribution, and model health at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total predictions" value={String(analytics.data?.totalPredictions ?? 0)} icon={Sparkles} hint="All models, all time" />
        <MetricCard label="Best model accuracy" value={percent(analytics.data?.bestModelAccuracy ?? 0)} icon={Target} tone="positive" hint="Holdout evaluation" />
        <MetricCard label="Models ready" value={`${readyModels}/${models.data?.length ?? 0}`} icon={Percent} hint="Trained and serving" />
        <MetricCard label="Datasets" value={String(datasets.data?.length ?? 0)} icon={Timer} hint="In the workspace" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Sentiment distribution" description="Predicted classes across all models." />
          <PanelBody>
            {analytics.data ? (
              <SentimentDonut data={analytics.data.distribution} height={280} />
            ) : (
              <LoadingBox />
            )}
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader title="Daily prediction volume" description="Positive / neutral / negative over time." />
          <PanelBody>
            {analytics.data ? (
              <SentimentTrendChart data={analytics.data.trend} height={280} />
            ) : (
              <LoadingBox />
            )}
          </PanelBody>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Model benchmark"
          description="Accuracy, precision, recall, and F1 across every trained model."
        />
        <PanelBody>
          {models.data ? (
            <MetricGroupedBarChart
              data={models.data.map((m) => ({
                model: m.name,
                accuracy: m.metrics.accuracy,
                precision: m.metrics.precision,
                recall: m.metrics.recall,
                f1: m.metrics.f1,
              }))}
              series={METRIC_SERIES}
              categoryKey="model"
            />
          ) : (
            <LoadingBox />
          )}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Recent predictions" description="Latest inference requests across all models." />
        <PanelBody className="p-0">
          <DataTable<Prediction>
            rows={recent.data ?? []}
            rowKey={(row) => row.id}
            isLoading={recent.isLoading}
            columns={[
              { key: "text", header: "Input text", cell: (row) => <span className="line-clamp-1 max-w-md">{row.text}</span> },
              { key: "model", header: "Model", cell: (row) => <ModelBadge model={row.model} /> },
              { key: "sentiment", header: "Sentiment", cell: (row) => <StatusBadge status={row.sentiment} /> },
              { key: "confidence", header: "Confidence", align: "right", cell: (row) => <span className="font-mono tabular-nums">{percent(row.confidence)}</span> },
              { key: "time", header: "Time", align: "right", hideBelow: "md", cell: (row) => <span className="text-on-surface-variant">{new Date(row.createdAt).toLocaleTimeString()}</span> },
            ]}
          />
        </PanelBody>
      </Panel>
    </div>
  );
}

function LoadingBox() {
  return (
    <div className="flex min-h-56 items-center justify-center font-mono text-label-md text-on-surface-variant">
      Loading…
    </div>
  );
}
