import { Icon } from "@iconify/react";
import { formatMonth, formatDate } from "@/helpers/dates";

export default function PayrollHeader({
  months,
  month,
  payrolls,
  selected,
  onMonthChange,
  onPayrollChange,
}) {
  const monthlyPayrolls = payrolls.filter(
    (payroll) => !month || payroll.date?.slice(0, 7) === month,
  );

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Payroll</h1>
        <p className="text-sm text-slate-500">
          Gaji, tunjangan, dan potongan berdasarkan periode payroll.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {months.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="sr-only">Filter bulan payroll</span>
            <Icon
              icon="lucide:calendar-days"
              width="17"
              className="text-slate-400"
            />
            <select
              value={month}
              onChange={(event) => onMonthChange(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            >
              {months.map((value) => (
                <option key={value} value={value}>
                  {formatMonth(value)}
                </option>
              ))}
            </select>
          </label>
        )}
        {monthlyPayrolls.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="sr-only">Pilih periode payroll</span>
            <select
              value={selected.id}
              onChange={(event) => onPayrollChange(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            >
              {monthlyPayrolls.map((payroll) => (
                <option key={payroll.id} value={payroll.id}>
                  {formatDate(payroll.date)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
