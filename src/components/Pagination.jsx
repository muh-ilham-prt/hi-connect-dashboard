import { Icon } from '@iconify/react'

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-sm text-slate-500 ${className}`}>
      <span>
        {totalItems > 0 ? `Menampilkan ${start}-${end} dari ${totalItems}` : 'Tidak ada hasil'}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          aria-label="Halaman sebelumnya"
        >
          <Icon icon="lucide:chevron-left" width="16" />
        </button>
        <span className="px-2 tabular-nums">
          Halaman {page} dari {Math.max(1, totalPages)}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          aria-label="Halaman berikutnya"
        >
          <Icon icon="lucide:chevron-right" width="16" />
        </button>
      </div>
    </div>
  )
}
