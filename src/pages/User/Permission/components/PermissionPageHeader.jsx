import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'

export default function PermissionPageHeader({ role, saving, onReset, onSave }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Link to="/roles" className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary">
          <Icon icon="lucide:arrow-left" width="16" />
          Peran
        </Link>
        <h1 className="text-2xl font-extrabold text-primary">Hak akses</h1>
        <p className="text-sm text-slate-500">
          Atur akses menu untuk <span className="font-semibold text-slate-700">{role.name}</span>.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Atur ulang
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-60"
        >
          <Icon icon={saving ? 'lucide:loader-2' : 'lucide:save'} width="16" className={saving ? 'animate-spin' : ''} />
          {saving ? 'Menyimpan...' : 'Simpan izin'}
        </button>
      </div>
    </div>
  )
}
