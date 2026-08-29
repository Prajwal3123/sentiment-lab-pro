import { cn } from "@/lib/utils";
import { thousands } from "@/lib/format";
import type { Sentiment } from "@/types";

/**
 * Confusion matrix rendered as a CSS grid — a chart library adds nothing here
 * and the cells need per-cell emphasis for correct vs. incorrect predictions.
 */
export function ConfusionMatrix({
  labels,
  matrix,
  className,
}: {
  labels: Sentiment[];
  matrix: number[][];
  className?: string;
}) {
  const rowTotals = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const max = Math.max(...matrix.flat(), 1);

  return (
    <div className={cn("w-full overflow-x-auto lab-scroll", className)}>
      <table className="w-full min-w-[420px] border-collapse text-center">
        <thead>
          <tr>
            <th scope="col" aria-label="Actual vs predicted" />
            {labels.map((label) => (
              <th
                key={label}
                scope="col"
                className="px-2 pb-2 font-mono text-label-sm font-medium uppercase tracking-wide text-on-surface-variant"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((actual, i) => (
            <tr key={actual}>
              <th
                scope="row"
                className="pr-3 text-right font-mono text-label-sm font-medium uppercase text-on-surface-variant"
              >
                {actual}
              </th>
              {labels.map((predicted, j) => {
                const correct = i === j;
                const intensity = matrix[i]![j]! / max;
                return (
                  <td key={predicted} className="p-1">
                    <div
                      className={cn(
                        "flex h-16 items-center justify-center rounded-md border font-mono text-body-md tabular-nums",
                        correct
                          ? "border-positive/40"
                          : "border-outline-variant",
                      )}
                      style={{
                        backgroundColor: correct
                          ? `rgb(79 219 200 / ${0.08 + intensity * 0.32})`
                          : `rgb(255 180 171 / ${0.05 + intensity * 0.28})`,
                      }}
                      title={`${actual} predicted as ${predicted}: ${thousands(matrix[i]![j]!)}`}
                    >
                      {thousands(matrix[i]![j]!)}
                    </div>
                  </td>
                );
              })}
              <td className="pl-2 font-mono text-label-sm tabular-nums text-on-surface-variant">
                {thousands(rowTotals[i]!)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-mono text-label-sm text-on-surface-variant">
        Rows = actual class, columns = predicted class, right column = row total.
      </p>
    </div>
  );
}
