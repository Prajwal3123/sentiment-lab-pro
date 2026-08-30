import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/AppShell";
import { Panel, PanelHeader, PanelBody } from "@/components/lab/primitives";
import { DataTable } from "@/components/lab/DataTable";
import { StatusBadge } from "@/components/lab/badges";
import { modelService } from "@/services/modelService";
import { percent } from "@/lib/format";
import type { SentimentModel } from "@/types";

export const Route = createFileRoute("/_app/models")({
  head: () => ({
    meta: [{ title: "Models — Sentiment Lab" }],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["models"], queryFn: modelService.getModels });

  return (
    <div className="space-y-6">
      <PageHeader title="Models" subtitle="Registered sentiment models and their evaluation metrics." />
      <Panel>
        <PanelHeader title="All models" description="Traditional ML and transformer models available in the lab." />
        <PanelBody className="p-0">
          {isLoading ? (
            <p className="p-6 font-mono text-label-md text-on-surface-variant">Loading models…</p>
          ) : error ? (
            <p className="p-6 text-destructive">{error.message}</p>
          ) : (
            <DataTable<SentimentModel>
              rows={data ?? []}
              rowKey={(row) => row.id}
              columns={[
                { key: "name", header: "Model", cell: (row) => row.name },
                { key: "type", header: "Type", cell: (row) => row.type },
                { key: "accuracy", header: "Accuracy", align: "right", cell: (row) => percent(row.metrics.accuracy) },
                { key: "precision", header: "Precision", align: "right", cell: (row) => percent(row.metrics.precision) },
                { key: "recall", header: "Recall", align: "right", cell: (row) => percent(row.metrics.recall) },
                { key: "f1", header: "F1", align: "right", cell: (row) => percent(row.metrics.f1) },
                { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
              ]}
            />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}
