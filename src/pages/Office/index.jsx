import { useState, useEffect, useCallback, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useSnackbar } from '@/components/Snackbar'
import Pagination from '@/components/Pagination'
import { http } from '@/helpers/http'
import {
  OfficeProfileList,
  OfficeFormModal,
  DeleteOfficeModal,
} from '@/pages/Office/components'

const PAGE_SIZE = 10

export default function Office() {
  const snackbar = useSnackbar()
  const [offices, setOffices] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 })
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingOffice, setEditingOffice] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingOffice, setDeletingOffice] = useState(null)

  const debounceRef = useRef(null)

  const fetchOffices = useCallback(async (p, kw) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE })
      if (kw?.trim()) params.set('keyword', kw.trim())
      const res = await http.get(`/company?${params}`)
      const items = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []
      const paginationMeta = res?.data?.data?.meta ?? res?.data?.meta ?? {
        page: p,
        per_page: PAGE_SIZE,
        total: items.length,
        last_page: 1,
      }
      setOffices(items)
      setMeta(paginationMeta)
    } catch {
      // http.js shows the error snackbar
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffices(page, query)
  }, [fetchOffices, page])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  function handleQueryChange(v) {
    setQuery(v)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchOffices(1, v), 400)
  }

  const hasMainOffice = offices.some((o) => o.isMain || o.is_main)

  async function handleSave(formData) {
    try {
      // Upload any newly-selected documents first; retain already-uploaded ones.
      const pending = (formData.support_documents ?? []).filter((d) => d._file)
      const existing = (formData.support_documents ?? []).filter((d) => !d._file)

      const uploaded = await Promise.all(
        pending.map(async (item) => {
          const fd = new FormData()
          fd.append('file', item._file)
          const res = await http.post('/general/upload', fd)
          // backend returns { code, message, data: { key, url } }
          const data = res?.data?.data ?? res?.data
          if (!data?.key) return null
          return {
            key: data.key,
            url: data.url,
            name: item.name,
            size: item.size,
            type: item.type,
          }
        })
      )

      const docs = [...existing, ...uploaded.filter(Boolean)]

      const payload = {
        ...formData,
        support_documents: docs.length ? JSON.stringify(docs) : null,
      }
      delete payload.support_documents_raw // safety

      if (editingOffice) {
        await http.put(`/company/${editingOffice.id}`, payload)
        snackbar.success('Kantor berhasil diperbarui')
      } else {
        await http.post('/company', payload)
        snackbar.success('Kantor berhasil ditambahkan')
      }
      setFormOpen(false)
      fetchOffices(page, query)
    } catch {
      // http.js shows the error snackbar; modal stays open so the user can retry
    }
  }

  async function handleDelete() {
    if (!deletingOffice) return
    try {
      await http.delete(`/company/${deletingOffice.id}`)
      snackbar.success('Kantor berhasil dihapus')
      setDeleteOpen(false)
      const newPage = offices.length === 1 && page > 1 ? page - 1 : page
      fetchOffices(newPage, query)
      setPage(newPage)
    } catch {
      // http.js shows the error snackbar
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Kantor</h1>
          <p className="text-sm text-slate-500">
            Profil perusahaan, kantor pusat, dan lokasi kantor cabang.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingOffice(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          <Icon icon="lucide:plus" width="18" />
          Tambah kantor
        </button>
      </div>

      {/* Office Locations Search & List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-primary">Daftar kantor</h2>
            <p className="text-xs text-slate-500">
              {meta.total} lokasi terdaftar
            </p>
          </div>
          <div className="relative">
            <Icon
              icon="lucide:search"
              width="16"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Cari kantor atau alamat"
              aria-label="Cari kantor atau alamat"
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
        </div>

        <section className="space-y-4">
          <OfficeProfileList
            offices={offices}
            loading={loading}
            onEdit={(o) => {
              setEditingOffice(o)
              setFormOpen(true)
            }}
            onDelete={(o) => {
              setDeletingOffice(o)
              setDeleteOpen(true)
            }}
          />
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
      </div>

      {/* Modals */}
      <OfficeFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        office={editingOffice}
        hasMainOffice={hasMainOffice}
        onGeolocateFail={(msg) => snackbar.error(msg)}
      />

      <DeleteOfficeModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        office={deletingOffice}
      />
    </div>
  )
}
