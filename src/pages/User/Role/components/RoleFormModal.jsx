import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'

const EMPTY_FORM = { name: '' }

export default function RoleFormModal({ isOpen, onClose, onSave, role }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (role) setForm({ name: role.name })
    else setForm(EMPTY_FORM)
    setErrors({})
  }, [role, isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: 'Nama peran wajib diisi.' })
      return
    }
    onSave({ name: form.name.trim() })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={role ? 'Ubah peran' : 'Tambah peran'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama peran</label>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="mis. Kepala Operasional"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
                errors.name ? 'border-red-400' : 'border-slate-300 focus:border-secondary'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition-colors">
            {role ? 'Simpan perubahan' : 'Tambah peran'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
