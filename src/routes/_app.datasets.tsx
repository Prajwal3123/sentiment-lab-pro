import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/AppShell";
import { Panel, PanelHeader, PanelBody } from "@/components/lab/primitives";
import { DataTable } from "@/components/lab/DataTable";
import { StatusBadge } from "@/components/lab/badges";
import { datasetService } from "@/services/datasetService";
import { formatDateTime } from "@/lib/format";
import type { Dataset } from "@/types";

export const Route = createFileRoute("/_app/datasets")({
  head: () => ({
    meta: [{ title: "Datasets — Sentiment Lab" }],
  }),
  component: DatasetsPage,
});

function DatasetsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["datasets"], queryFn: datasetService.getDatasets });

  return (
    <div className="space-y-6">
      <PageHeader title="Datasets" subtitle="Uploaded corpora and their preprocessing pipeline status." />
      <Panel>
        <PanelHeader title="All datasets" description="Source corpora available for training and evaluation." />
        <PanelBody className="p-0">
          <DataTable<Dataset>
            rows={data ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={error?.message}
            columns={[
              { key: "name", header: "Name", cell: (row) => row.name },
              { key: "source", header: "Source", cell: (row) => row.source },
              { key: "format", header: "Format", cell: (row) => row.format.toUpperCase() },
              { key: "records", header: "Records", align: "right", cell: (row) => row.records.toLocaleString() },
              { key: "size", header: "Size", align: "right", cell: (row) => `${row.sizeMb.toFixed(1)} MB` },
              { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
              { key: "updated", header: "Updated", align: "right", cell: (row) => formatDateTime(row.updatedAt) },
            ]}
          />
        </PanelBody>
      </Panel>
    </div>
  );
}
