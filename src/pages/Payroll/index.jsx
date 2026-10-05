import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import { http } from "@/helpers/http";
import {
  PayrollHeader,
  PayrollSummaryCards,
  PayrollTable,
  PayslipDetail,
} from "./components";

const EMPTY_SUMMARY = {
  id: "",
  date: "",
  totalNetPay: 0,
  grossPay: 0,
  deduction: 0,
  details: [],
};

function readPayrolls(response) {
  const rows = response?.data?.data;
  return Array.isArray(rows) ? rows : [];
}

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [month, setMonth] = useState("");
  const [detailPayroll, setDetailPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    http
      .get("/payroll")
      .then((response) => {
        if (!active) return;
        const rows = readPayrolls(response);
        setPayrolls(rows);
        setMonth((current) => current || rows[0]?.date?.slice(0, 7) || "");
        setSelectedId((current) =>
          rows.some((row) => row.id === current) ? current : (rows[0]?.id ?? ""),
        );
      })
      .catch(() => {
        // http.js displays the request error snackbar.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const months = [
    ...new Set(
      payrolls.map((payroll) => payroll.date?.slice(0, 7)).filter(Boolean),
    ),
  ].sort((a, b) => b.localeCompare(a));
  const monthlyPayrolls = payrolls.filter(
    (payroll) => !month || payroll.date?.slice(0, 7) === month,
  );
  const selected = useMemo(
    () =>
      monthlyPayrolls.find((payroll) => payroll.id === selectedId) ??
      monthlyPayrolls[0] ??
      EMPTY_SUMMARY,
    [monthlyPayrolls, selectedId],
  );
  const details = Array.isArray(selected.details) ? selected.details : [];

  function handleMonthChange(nextMonth) {
    setMonth(nextMonth);
    setSelectedId(
      payrolls.find((payroll) => payroll.date?.slice(0, 7) === nextMonth)?.id ??
        "",
    );
  }

  return (
    <div className="space-y-5">
      <PayrollHeader
        months={months}
        month={month}
        payrolls={payrolls}
        selected={selected}
        onMonthChange={handleMonthChange}
        onPayrollChange={setSelectedId}
      />

      {loading ? (
        <section className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-16 text-sm text-slate-500">
          <Icon
            icon="lucide:loader-2"
            width="20"
            className="animate-spin text-primary"
          />
          Memuat data payroll…
        </section>
      ) : payrolls.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center">
          <Icon
            icon="lucide:wallet-cards"
            width="40"
            className="mx-auto text-slate-300"
          />
          <p className="mt-3 font-semibold text-slate-800">
            Belum ada data payroll
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Data penggajian akan tampil di sini setelah tersedia.
          </p>
        </section>
      ) : (
        <>
          <PayrollSummaryCards payroll={selected} employeeCount={details.length} />
          <PayrollTable
            details={details}
            onViewPayslip={(detail) => setDetailPayroll({ payroll: selected, detail })}
          />
        </>
      )}

      <Modal
        isOpen={Boolean(detailPayroll)}
        onClose={() => setDetailPayroll(null)}
        title="Slip gaji"
        maxWidth="max-w-md"
      >
        {detailPayroll && (
          <PayslipDetail
            payroll={detailPayroll.payroll}
            detail={detailPayroll.detail}
            onClose={() => setDetailPayroll(null)}
          />
        )}
      </Modal>
    </div>
  );
}
