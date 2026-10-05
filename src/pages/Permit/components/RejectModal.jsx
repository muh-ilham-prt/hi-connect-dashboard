import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { fmt } from "@/helpers/dates";

export function RejectModal({ isOpen, onClose, onConfirm, request }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(false);
    }
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason.trim());
  }

  if (!request) return null;

  const empName = request.employee?.name || "Karyawan";
  const typeName = request.type?.name || "Izin";
  const startDate =
    request.startDate || request.start_date
      ? new Date(request.startDate || request.start_date)
      : null;
  const endDate =
    request.endDate || request.end_date
      ? new Date(request.endDate || request.end_date)
      : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tolak permohonan Izin"
      maxWidth="max-w-md"
    >
      <p className="text-sm text-slate-500">
        {empName} · {typeName}
        {startDate && endDate
          ? `, ${fmt.format(startDate)} – ${fmt.format(endDate)}`
          : ""}
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Alasan penolakan
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError(false);
          }}
          placeholder="Masukkan alasan penolakan permohonan ini..."
          className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
            error ? "border-red-400" : "border-slate-300 focus:border-secondary"
          }`}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600">
            Masukkan alasan penolakan.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Tolak permohonan
          </button>
        </div>
      </form>
    </Modal>
  );
}
