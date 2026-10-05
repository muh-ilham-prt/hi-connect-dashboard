import { Icon } from "@iconify/react";
import { benefitsText, formatRupiah } from "@/helpers/currency";

export default function PayrollTable({ details, onViewPayslip }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Karyawan</th>
              <th className="px-3 py-3 text-right font-semibold">Manfaat</th>
              <th className="px-3 py-3 text-right font-semibold">Gaji kotor</th>
              <th className="px-3 py-3 text-right font-semibold">Gaji bersih</th>
              <th className="px-5 py-3 text-right font-semibold">Slip gaji</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {details.map((detail) => {
              const employeeName = detail.employee?.name ?? "Karyawan tanpa nama";
              return (
                <tr key={detail.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-soft text-xs font-bold text-primary">
                        {employeeName
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">
                          {employeeName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {detail.employee?.email ?? "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-600">
                    {benefitsText(detail.benefits)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatRupiah(detail.grossSalary)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold tabular-nums text-primary">
                    {formatRupiah(detail.netSalary)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onViewPayslip(detail)}
                      className="ml-auto grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-secondary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                      title="Lihat slip gaji"
                      aria-label={`Lihat slip gaji ${employeeName}`}
                    >
                      <Icon icon="lucide:file-text" width="18" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {details.length === 0 && (
        <p className="px-5 py-14 text-center text-sm text-slate-500">
          Belum ada rincian karyawan untuk periode ini.
        </p>
      )}
    </section>
  );
}
