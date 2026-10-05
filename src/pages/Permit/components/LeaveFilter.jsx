import { Icon } from "@iconify/react";
import { STATUSES, STATUS_LABELS } from "./statuses";

export function LeaveFilter({ query, onQueryChange, status, onStatusChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <div className="relative">
        <Icon
          icon="lucide:search"
          width="16"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari berdasarkan alasan"
          aria-label="Cari permohonan izin berdasarkan alasan"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter berdasarkan status"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
      >
        <option value="">Semua status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
