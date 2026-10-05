import { Icon } from '@iconify/react'
import InitialsAvatar from '@/components/InitialsAvatar'

const FMT_DATE = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function fmtDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return isNaN(date) ? '-' : FMT_DATE.format(date)
}

export default function UserTable({ users, loading, onEdit, onResetPassword, onDelete, onClearFilters }) {
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
        <Icon icon="lucide:loader-2" width="20" className="animate-spin text-primary" />
        <span>Memuat pengguna...</span>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <Icon icon="lucide:users" width="36" height="36" className="mx-auto text-slate-300" />
        <p className="mt-2 font-semibold text-slate-800">Pengguna tidak ditemukan</p>
        <p className="text-sm text-slate-500">Coba sesuaikan kata kunci pencarian Anda.</p>
        <button
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
        >
          Hapus pencarian
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Pengguna</th>
            <th className="px-3 py-3 font-semibold">Peran</th>
            <th className="px-3 py-3 font-semibold">Dibuat</th>
            <th className="px-5 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => {
            const isSuperuser = user.email?.toLowerCase() === 'superuser@hik.com'
            return (
              <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={user.name} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-block rounded-full bg-secondary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                    {user.role?.name || '-'}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-600 text-xs">{fmtDate(user.created_at)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    {!isSuperuser && (
                      <button
                        onClick={() => onEdit(user)}
                        className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-secondary-soft hover:text-primary transition-colors"
                        aria-label={`Ubah ${user.name}`}
                        title="Ubah pengguna"
                      >
                        <Icon icon="lucide:pencil" width="16" />
                      </button>
                    )}
                    <button
                      onClick={() => onResetPassword(user)}
                      className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      aria-label={`Ubah kata sandi untuk ${user.name}`}
                      title="Ubah kata sandi"
                    >
                      <Icon icon="lucide:key-round" width="16" />
                    </button>
                    {!isSuperuser && (
                      <button
                        onClick={() => onDelete(user)}
                        className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Hapus ${user.name}`}
                        title="Hapus pengguna"
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
