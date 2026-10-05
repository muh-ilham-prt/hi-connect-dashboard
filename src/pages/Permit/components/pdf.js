import { fullDate, workingDays } from "@/helpers/dates";
import { escapeHtml, printHtml } from "@/helpers/pdf";
import { STATUS_LABELS } from "./statuses";

const ref = (r) => "IZIN-" + String(r.id).slice(0, 8).toUpperCase();

export function downloadPdf(r) {
  const startDate =
    r.startDate || r.start_date
      ? new Date(r.startDate || r.start_date)
      : new Date();
  const endDate =
    r.endDate || r.end_date ? new Date(r.endDate || r.end_date) : startDate;
  const days = workingDays(startDate, endDate);
  const employeeName = r.employee?.name || "Tidak diketahui";
  const employeeEmail = r.employee?.email || "-";
  const typeName = r.type?.name || "Izin";
  const documentRef = ref(r);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Permohonan izin ${documentRef}</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;margin:0;padding:0}
  .header{background:#1a2e75;color:#fff;padding:20px 28px;display:flex;justify-content:space-between;align-items:center}
  .header h1{margin:0;font-size:18px}
  .header span{font-size:11px;opacity:.8}
  .body{padding:28px}
  h2{color:#1a2e75;margin:0 0 4px}
  .subtitle{color:#64748b;font-size:13px;margin:0 0 24px}
  table{width:100%;border-collapse:collapse}
  td{padding:9px 12px;font-size:13px;border-bottom:1px solid #e2e8f0;vertical-align:top}
  td:first-child{color:#64748b;font-weight:600;width:140px}
  .sigs{margin-top:48px;display:flex;justify-content:space-between}
  .sig{width:42%}
  .sig-line{border-top:1px solid #94a3b8;padding-top:6px;font-size:11px;color:#64748b}
  .footer{font-size:10px;color:#94a3b8;margin-top:32px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<div class="header">
  <h1>Hi-Connect</h1>
  <span>Formulir permohonan izin</span>
</div>
<div class="body">
  <h2>Permohonan izin ${escapeHtml(documentRef)}</h2>
  <p class="subtitle">Status: ${escapeHtml(STATUS_LABELS[r.status] ?? r.status)}</p>
  <table>
    <tr><td>Karyawan</td><td>${escapeHtml(employeeName)}</td></tr>
    <tr><td>Email</td><td>${escapeHtml(employeeEmail)}</td></tr>
    <tr><td>Jenis izin</td><td>${escapeHtml(typeName)}</td></tr>
    <tr><td>Tanggal</td><td>${escapeHtml(fullDate.format(startDate))} s.d. ${escapeHtml(fullDate.format(endDate))}</td></tr>
    <tr><td>Hari kerja</td><td>${days}</td></tr>
    <tr><td>Alasan</td><td>${escapeHtml(r.reason || "-")}</td></tr>
  </table>
  <div class="sigs">
    <div class="sig"><div class="sig-line">Tanda tangan karyawan</div></div>
    <div class="sig"><div class="sig-line">Tanda tangan persetujuan HR</div></div>
  </div>
  <div class="footer">Dibuat pada ${fullDate.format(new Date())}</div>
</div>
</body>
</html>`;

  printHtml(html);
}