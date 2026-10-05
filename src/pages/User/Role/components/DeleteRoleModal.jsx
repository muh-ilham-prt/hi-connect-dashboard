import Modal from '@/components/Modal'

export default function DeleteRoleModal({ isOpen, onClose, onConfirm, role }) {
  if (!role) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus peran?" maxWidth="max-w-sm">
      <p className="text-sm text-slate-600">
        Peran <span className="font-semibold text-slate-800">{role.name}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
          Hapus peran
        </button>
      </div>
    </Modal>
  )
}
