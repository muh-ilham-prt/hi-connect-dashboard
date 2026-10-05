import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import Modal from '@/components/Modal'

export function DivisionTable({ divisions, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Nama divisi</th>
            <th className="px-3 py-3 font-semibold">Dibuat</th>
            <th className="px-5 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {divisions.map((d) => (
            <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3">
                <p className="font-semibold text-slate-800">{d.name}</p>
              </td>
              <td className="px-3 py-3 text-xs text-slate-600">
                {d.created_at
                  ? new Intl.DateTimeFormat('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(d.created_at))
                  : '-'}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(d)}
                    className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                    aria-label={`Ubah ${d.name}`}
                    title="Ubah divisi"
                  >
                    <Icon icon="lucide:pencil" width="16" />
                  </button>
                  <button
                    onClick={() => onDelete(d)}
                    className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label={`Hapus ${d.name}`}
                    title="Hapus divisi"
                  >
                    <Icon icon="lucide:trash-2" width="16" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const EMPTY_FORM = { name: '' }

export function DivisionFormModal({ isOpen, onClose, onSave, division }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (division) setForm({ name: division.name })
    else setForm(EMPTY_FORM)
    setErrors({})
  }, [division, isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: 'Nama divisi wajib diisi.' })
      return
    }
    onSave({ name: form.name.trim() })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={division ? 'Ubah divisi' : 'Tambah divisi'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Nama divisi *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="mis. Teknik"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
                errors.name ? 'border-red-400' : 'border-slate-300 focus:border-secondary'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
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
            {division ? 'Simpan perubahan' : 'Tambah divisi'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function DeleteDivisionModal({ isOpen, onClose, onConfirm, division }) {
  if (!division) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus divisi?" maxWidth="max-w-sm">
      <p className="text-sm text-slate-600">
        Divisi <span className="font-semibold text-slate-800">{division.name}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
          Hapus divisi
        </button>
      </div>
    </Modal>
  )
}
