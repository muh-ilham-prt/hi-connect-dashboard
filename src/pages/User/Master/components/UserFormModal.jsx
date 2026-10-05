import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import SearchSelect from '@/components/SearchSelect'
import { http } from '@/helpers/http'

const EMPTY_FORM = { name: '', email: '', password: '', role_id: '' }

export default function UserFormModal({ isOpen, onClose, onSave, user }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)

  const loadRoles = (keyword = '') => {
    setRolesLoading(true)
    const params = new URLSearchParams({ per_page: 100 })
    if (keyword?.trim()) params.set('keyword', keyword.trim())
    http.get(`/role?${params}`)
      .then((response) => setRoles(response.data.data ?? []))
      .catch(() => {})
      .finally(() => setRolesLoading(false))
  }

  useEffect(() => {
    if (!isOpen) return
    loadRoles()
  }, [isOpen])

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? '', email: user.email ?? '', password: '', role_id: user.role_id ?? '' })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [user, isOpen])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Nama lengkap wajib diisi.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Masukkan alamat email yang valid.'
    }
    if (!form.role_id) nextErrors.role_id = 'Silakan pilih peran.'
    if (!user) {
      if (!form.password) nextErrors.password = 'Kata sandi wajib diisi.'
      else if (form.password.length < 6) nextErrors.password = 'Kata sandi minimal 6 karakter.'
    }
    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const payload = { name: form.name.trim(), email: form.email.trim(), role_id: form.role_id }
    if (!user || form.password) payload.password = form.password
    onSave(payload)
  }

  const field = (key, label, type = 'text', extra = {}) => (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label} *</label>
      <input
        type={type}
        value={form[key]}
        onChange={(event) => set(key, event.target.value)}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
          errors[key] ? 'border-red-400' : 'border-slate-300 focus:border-secondary'
        }`}
        {...extra}
      />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Ubah pengguna' : 'Tambah pengguna'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {field('name', 'Nama lengkap')}
        {field('email', 'Email', 'email')}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Peran *</label>
          <SearchSelect
            value={form.role_id}
            onChange={(value) => {
              set('role_id', value)
              if (errors.role_id) setErrors((current) => ({ ...current, role_id: undefined }))
            }}
            options={roles.map((role) => ({ value: role.id, label: role.name }))}
            placeholder="Pilih peran"
            loading={rolesLoading}
            loadingText="Memuat peran..."
            emptyText="Peran tidak ditemukan"
            onSearch={(keyword) => loadRoles(keyword)}
          />
          {errors.role_id && <p className="mt-1 text-xs text-red-600">{errors.role_id}</p>}
        </div>

        {!user && (
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Kata sandi *</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => set('password', event.target.value)}
              autoComplete="new-password"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
                errors.password ? 'border-red-400' : 'border-slate-300 focus:border-secondary'
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition-colors">
            {user ? 'Simpan perubahan' : 'Tambah pengguna'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
