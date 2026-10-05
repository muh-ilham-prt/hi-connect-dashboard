import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import Pagination from '@/components/Pagination'
import { useSnackbar } from '@/components/Snackbar'
import { http } from '@/helpers/http'
import {
  DeleteDivisionModal,
  DivisionFormModal,
  DivisionTable,
} from '@/pages/Division/components'

const PAGE_SIZE = 10
const EMPTY_META = { page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 }

export default function Division() {
  const snackbar = useSnackbar()
  const [divisions, setDivisions] = useState([])
  const [meta, setMeta] = useState(EMPTY_META)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingDivision, setEditingDivision] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingDivision, setDeletingDivision] = useState(null)
  const debounceRef = useRef(null)

  const fetchDivisions = useCallback(async (p, keyword) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE })
      if (keyword?.trim()) params.set('keyword', keyword.trim())
      const res = await http.get(`/division?${params}`)
      setDivisions(res.data.data)
      setMeta(res.data.meta)
    } catch {
      // http.js shows the snackbar
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDivisions(page, query)
  }, [fetchDivisions, page])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  function handleQueryChange(value) {
    setQuery(value)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchDivisions(1, value), 400)
  }

  async function handleSave(formData) {
    try {
      if (editingDivision) {
        await http.put(`/division/${editingDivision.id}`, formData)
        snackbar.success('Divisi berhasil diperbarui')
      } else {
        await http.post('/division', formData)
        snackbar.success('Divisi berhasil dibuat')
      }
      setFormOpen(false)
      fetchDivisions(page, query)
    } catch {
      // http.js shows the snackbar
    }
  }

  async function handleDelete() {
    if (!deletingDivision) return
    try {
      await http.delete(`/division/${deletingDivision.id}`)
      snackbar.success('Divisi berhasil dihapus')
      setDeleteOpen(false)
      const nextPage = divisions.length === 1 && page > 1 ? page - 1 : page
      setPage(nextPage)
      if (nextPage === page) fetchDivisions(nextPage, query)
    } catch {
      // http.js shows the snackbar
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Divisi</h1>
          <p className="text-sm text-slate-500">
            {meta.total} divisi
          </p>
        </div>
        <button
          onClick={() => { setEditingDivision(null); setFormOpen(true) }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          <Icon icon="lucide:plus" width="18" />
          Tambah divisi
        </button>
      </div>

      <div className="relative max-w-sm">
        <Icon
          icon="lucide:search"
          width="16"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Cari divisi"
          aria-label="Cari divisi"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        {loading && divisions.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
            <Icon icon="lucide:loader-2" width="20" className="animate-spin text-primary" />
            <span>Memuat divisi...</span>
          </div>
        ) : divisions.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Icon icon="lucide:building-2" width="36" height="36" className="mx-auto text-slate-300" />
            <p className="mt-2 font-semibold text-slate-800">Divisi tidak ditemukan</p>
            <button
              onClick={() => handleQueryChange('')}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
            >
              Hapus pencarian
            </button>
          </div>
        ) : (
          <DivisionTable
            divisions={divisions}
            onEdit={(division) => { setEditingDivision(division); setFormOpen(true) }}
            onDelete={(division) => { setDeletingDivision(division); setDeleteOpen(true) }}
          />
        )}
        {meta.total > 0 && (
          <Pagination
            page={meta.page}
            totalPages={meta.last_page}
            totalItems={meta.total}
            pageSize={meta.per_page}
            onPageChange={setPage}
          />
        )}
      </section>

      <DivisionFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        division={editingDivision}
      />
      <DeleteDivisionModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        division={deletingDivision}
      />
    </div>
  )
}
