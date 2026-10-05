import { Icon } from "@iconify/react";
import { STATUS_LABELS } from "./statuses";

const SUMMARY_CARDS = [
  { key: "Pending", icon: "lucide:hourglass" },
  { key: "Approved", icon: "lucide:circle-check" },
  { key: "Rejected", icon: "lucide:circle-x" },
];

export function LeaveSummaryCards({
  counts = {},
  activeStatus,
  onSelectStatus,
}) {
  return (
    <section
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      aria-label="Ringkasan permohonan izin"
    >
      {SUMMARY_CARDS.map(({ key, icon }) => {
        const isActive = activeStatus === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectStatus(isActive ? "" : key)}
            className={`flex items-center justify-between rounded-xl border bg-white p-4 text-left transition hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 ${
              isActive
                ? "border-secondary ring-2 ring-secondary/20"
                : "border-slate-200"
            }`}
          >
            <span>
              <span className="block text-sm font-medium text-slate-500">
                {STATUS_LABELS[key]}
              </span>
              <span className="block text-2xl font-extrabold text-primary tabular-nums">
                {counts[key] ?? 0}
              </span>
            </span>
            <span className="grid size-9 place-items-center rounded-lg bg-secondary-soft text-secondary">
              <Icon icon={icon} width="18" />
            </span>
          </button>
        );
      })}
    </section>
  );
}
