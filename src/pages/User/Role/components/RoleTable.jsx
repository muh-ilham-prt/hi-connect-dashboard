import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'

export default function RoleTable({ roles, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Peran</th>
            <th className="px-3 py-3 font-semibold">Dibuat</th>
            <th className="px-5 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {roles.map((role) => {
            const isSuperuser = role.name?.toLowerCase() === 'superuser'
            return (
              <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    {role.name}
                    {isSuperuser && (
                      <span className="rounded-full bg-secondary-soft px-2 py-0.5 text-xs font-semibold text-primary">Sistem</span>
                    )}
                  </p>
                </td>
                <td className="px-3 py-3 text-slate-600 text-xs">
                  {role.created_at ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(role.created_at)) : '-'}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/roles/${role.id}/permissions`}
                      className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                      aria-label={`Atur izin untuk ${role.name}`}
                      title="Hak akses"
                    >
                      <Icon icon="lucide:shield-check" width="16" />
                    </Link>
                    {!isSuperuser && (
                      <button
                        onClick={() => onEdit(role)}
                        className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                        aria-label={`Ubah ${role.name}`}
                        title="Ubah nama peran"
                      >
                        <Icon icon="lucide:pencil" width="16" />
                      </button>
                    )}
                    {!isSuperuser && (
                      <button
                        onClick={() => onDelete(role)}
                        className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Hapus ${role.name}`}
                        title="Hapus peran"
                      >
                        <Icon icon="lucide:trash-2" width="16" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
