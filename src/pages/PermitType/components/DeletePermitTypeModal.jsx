import Modal from "@/components/Modal";

export default function DeletePermitTypeModal({
  isOpen,
  onClose,
  onConfirm,
  permitType,
}) {
  if (!permitType) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus jenis izin?"
      maxWidth="max-w-sm"
    >
      <p className="text-sm text-slate-600">
        Jenis izin{" "}
        <span className="font-semibold text-slate-800">{permitType.name}</span>{" "}
        akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
          Hapus jenis izin
        </button>
      </div>
    </Modal>
  );
}

