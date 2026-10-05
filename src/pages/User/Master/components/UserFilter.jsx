import { Icon } from '@iconify/react'

export default function UserFilter({ query, onQueryChange }) {
  return (
    <div className="relative max-w-sm">
      <Icon
        icon="lucide:search"
        width="16"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Cari nama, email, atau telepon"
        aria-label="Cari pengguna"
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
      />
    </div>
  )
}
