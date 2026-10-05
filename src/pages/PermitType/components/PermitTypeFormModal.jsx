import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

const EMPTY_FORM = { name: "", description: "" };

export default function PermitTypeFormModal({
  isOpen,
  onClose,
  onSave,
  permitType,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (permitType) {
      setForm({
        name: permitType.name ?? "",
        description: permitType.description ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [permitType, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Nama jenis izin wajib diisi." });
      return;
    }
    onSave({
      name: form.name.trim(),
      description: form.description?.trim() || null,
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={permitType ? "Ubah jenis izin" : "Tambah jenis izin"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Nama jenis izin *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Contoh: Sakit, Cuti Tahunan"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
                errors.name
                  ? "border-red-400"
                  : "border-slate-300 focus:border-secondary"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Deskripsi
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Catatan atau persyaratan opsional..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
        </div>

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
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition-colors"
          >
            {permitType ? "Simpan perubahan" : "Tambah jenis izin"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

