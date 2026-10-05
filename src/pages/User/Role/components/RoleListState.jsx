import { Icon } from '@iconify/react'

export default function RoleListState({ loading, roles, onClear }) {
  if (loading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
        <Icon icon="lucide:loader-2" width="20" className="animate-spin text-primary" />
        <span>Memuat peran...</span>
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <Icon icon="lucide:shield" width="36" height="36" className="mx-auto text-slate-300" />
        <p className="mt-2 font-semibold text-slate-800">Peran tidak ditemukan</p>
        <button
          onClick={onClear}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
        >
          Hapus pencarian
        </button>
      </div>
    )
  }

  return null
}
