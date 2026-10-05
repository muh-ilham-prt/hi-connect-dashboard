import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
// ---- Delete Office Modal ----
export default function DeleteOfficeModal({ isOpen, onClose, onConfirm, office }) {
  if (!office) return null;
  const isMain = Boolean(office.isMain || office.is_main);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus kantor?"
      maxWidth="max-w-sm"
    >
      {isMain ? (
        <>
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            <Icon
              icon="lucide:triangle-alert"
              width="18"
              className="mt-0.5 shrink-0"
            />
            <p>
              <span className="font-semibold">{office.name}</span> saat ini
              ditetapkan sebagai kantor utama. Tetapkan kantor lain sebagai
              kantor utama sebelum menghapusnya.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-600">
            Kantor{" "}
            <span className="font-semibold text-slate-800">{office.name}</span>{" "}
            akan dihapus secara permanen.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Hapus kantor
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
