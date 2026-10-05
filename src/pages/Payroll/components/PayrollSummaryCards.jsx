import { Icon } from "@iconify/react";
import { formatRupiah } from "@/helpers/currency";

export default function PayrollSummaryCards({ payroll, employeeCount }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total gaji bersih"
        value={formatRupiah(payroll.totalNetPay)}
        icon="lucide:wallet"
      />
      <SummaryCard
        label="Total gaji kotor"
        value={formatRupiah(payroll.grossPay ?? payroll.grosPay)}
        icon="lucide:banknote"
      />
      <SummaryCard
        label="Total potongan"
        value={formatRupiah(payroll.deduction)}
        icon="lucide:minus-circle"
      />
      <SummaryCard
        label="Karyawan"
        value={employeeCount}
        icon="lucide:users"
      />
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 truncate text-lg font-extrabold text-primary">
          {value}
        </p>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary-soft text-secondary">
        <Icon icon={icon} width="19" />
      </span>
    </div>
  );
}
