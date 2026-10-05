import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'

export default function PermissionLoadState({ loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Icon icon="lucide:loader-2" width="22" className="animate-spin text-primary" />
        <span>Memuat peran...</span>
      </div>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <Icon icon="lucide:shield-alert" width="36" height="36" className="mx-auto text-slate-300" />
      <h1 className="mt-3 text-xl font-bold text-primary">Peran tidak ditemukan</h1>
      <p className="mt-1 text-sm text-slate-500">Peran ini mungkin telah dihapus atau tautannya tidak valid.</p>
      <Link to="/roles" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary">
        Kembali ke peran
      </Link>
    </section>
  )
}
