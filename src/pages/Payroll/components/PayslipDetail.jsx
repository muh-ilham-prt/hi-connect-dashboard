import { benefitsText, formatRupiah } from "@/helpers/currency";
import { formatMonth } from "@/helpers/dates";

export default function PayslipDetail({ payroll, detail, onClose }) {
  const employee = detail.employee ?? {};
  const deductions =
    detail.deduction == null ? null : formatRupiah(detail.deduction);
  const rows = (items) =>
    items.map(([label, value]) => (
      <div key={label} className="flex justify-between gap-4 py-1.5">
        <span>{label}</span>
        <span className="text-right tabular-nums">{value}</span>
      </div>
    ));

  return (
    <>
      <p className="-mt-4 text-sm text-slate-500">
        {employee.name ?? "Karyawan tanpa nama"} ·{" "}
        {formatMonth(payroll.date.slice(0, 7))}
      </p>
      <div className="mt-5 space-y-5 text-sm">
        <section>
          <h3 className="font-bold text-primary">Penghasilan</h3>
          <div className="mt-1 divide-y divide-slate-100">
            {rows([
              ["Gaji kotor", formatRupiah(detail.grossSalary)],
              ["Manfaat", benefitsText(detail.benefits)],
            ])}
          </div>
        </section>
        <section>
          <h3 className="font-bold text-primary">Potongan</h3>
          <div className="mt-1 divide-y divide-slate-100 text-red-600">
            {rows([
              [
                "Total potongan",
                deductions ?? "Rincian potongan tidak tersedia",
              ],
            ])}
          </div>
        </section>
        <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-white">
          <span className="font-semibold">Gaji bersih</span>
          <span className="text-lg font-extrabold tabular-nums">
            {formatRupiah(detail.netSalary)}
          </span>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>
    </>
  );
}
