import { Icon } from '@iconify/react'

export default function RoleHeader({ total, onAdd }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Peran dan akses</h1>
        <p className="text-sm text-slate-500">{total} peran ditentukan</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
      >
        <Icon icon="lucide:shield-plus" width="18" />
        Tambah peran
      </button>
    </div>
  )
}
