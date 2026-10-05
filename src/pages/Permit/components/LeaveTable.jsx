import { Icon } from "@iconify/react";
import StatusBadge from "@/components/StatusBadge";
import InitialsAvatar from "@/components/InitialsAvatar";
import { fmt, workingDays } from "@/helpers/dates";
import { STATUS_LABELS } from "./statuses";

export function LeaveTable({
  requests,
  loading,
  onApprove,
  onReject,
  onViewDetail,
  onDownloadPdf,
  onClearFilters,
}) {
  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
        <Icon
          icon="lucide:loader-2"
          width="20"
          className="animate-spin text-primary"
        />
        <span>Memuat permohonan...</span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <Icon
          icon="lucide:inbox"
          width="36"
          height="36"
          className="mx-auto text-slate-300"
        />
        <p className="mt-2 font-semibold text-slate-800">
          Permohonan izin tidak ditemukan
        </p>
        <p className="text-sm text-slate-500">
          Coba kata kunci lain atau hapus filter.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
        >
          Hapus filter
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-205 text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Karyawan</th>
            <th className="px-3 py-3 font-semibold">Jenis Izin</th>
            <th className="px-3 py-3 font-semibold">Tanggal</th>
            <th className="px-3 py-3 font-semibold">Alasan</th>
            <th className="px-3 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((r) => {
            const startDate =
              r.startDate || r.start_date
                ? new Date(r.startDate || r.start_date)
                : null;
            const endDate =
              r.endDate || r.end_date
                ? new Date(r.endDate || r.end_date)
                : null;
            const days =
              startDate && endDate ? workingDays(startDate, endDate) : "-";
            const employeeName = r.employee?.name || "Tidak diketahui";
            const employeeEmail = r.employee?.email || "";
            const typeName = r.type?.name || "Izin";

            return (
              <tr
                key={r.id}
                className="align-top hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={employeeName} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {employeeName}
                      </p>
                      {employeeEmail && (
                        <p className="truncate text-xs text-slate-500">
                          {employeeEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-700 font-medium">
                  {typeName}
                </td>
                <td className="px-3 py-3">
                  {startDate && endDate ? (
                    <>
                      <p className="whitespace-nowrap text-slate-700">
                        {fmt.format(startDate)}
                        {startDate.getTime() !== endDate.getTime()
                          ? ` – ${fmt.format(endDate)}`
                          : ""}
                      </p>
                      <p className="text-xs text-slate-500">
                        {days} hari kerja
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="max-w-50 px-3 py-3">
                  <p className="truncate text-slate-600" title={r.reason}>
                    {r.reason || "-"}
                  </p>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge
                    status={r.status}
                    label={STATUS_LABELS[r.status] ?? r.status}
                  />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    {r.status === "Pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(r.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                          aria-label={`Setujui permohonan ${employeeName}`}
                        >
                          <Icon icon="lucide:check" width="16" />
                          Setujui
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(r)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                          aria-label={`Tolak permohonan ${employeeName}`}
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewDetail(r)}
                      className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                      title="Lihat detail"
                      aria-label={`Lihat detail permohonan ${employeeName}`}
                    >
                      <Icon icon="lucide:eye" width="18" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadPdf(r)}
                      className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                      title="Unduh PDF"
                      aria-label={`Unduh PDF permohonan ${employeeName}`}
                    >
                      <Icon icon="lucide:file-down" width="18" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
