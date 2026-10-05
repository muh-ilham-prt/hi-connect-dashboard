import { useState, useEffect, useCallback, useRef } from 'react'
import { useSnackbar } from '@/components/Snackbar'
import { http } from '@/helpers/http'
import Pagination from '@/components/Pagination'
import {
  RoleTable,
  RoleFormModal,
  DeleteRoleModal,
  RoleHeader,
  RoleSearch,
  RoleListState,
} from '@/pages/User/Role/components'

const PAGE_SIZE = 10

export default function UserRole() {
  const snackbar = useSnackbar()
  const [roles, setRoles] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 })
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingRole, setDeletingRole] = useState(null)

  const debounceRef = useRef(null)

  const fetchRoles = useCallback(async (p, kw) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE })
      if (kw?.trim()) params.set('keyword', kw.trim())
      const res = await http.get(`/role?${params}`)
      setRoles(res.data.data)
      setMeta(res.data.meta)
    } catch {
      // http.js shows the snackbar
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRoles(page, query) }, [fetchRoles, page])

  function handleQueryChange(value) {
    setQuery(value)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchRoles(1, value), 400)
  }

  async function handleSave(formData) {
    try {
      if (editingRole) {
        await http.put(`/role/${editingRole.id}`, formData)
        snackbar.success('Peran berhasil diperbarui')
      } else {
        await http.post('/role', formData)
        snackbar.success('Peran berhasil dibuat')
      }
      setFormOpen(false)
      fetchRoles(page, query)
    } catch {
      // http.js shows the snackbar
    }
  }

  async function handleDelete() {
    if (!deletingRole) return
    try {
      await http.delete(`/role/${deletingRole.id}`)
      snackbar.success('Peran berhasil dihapus')
      setDeleteOpen(false)
      const newPage = roles.length === 1 && page > 1 ? page - 1 : page
      fetchRoles(newPage, query)
      setPage(newPage)
    } catch {
      // http.js shows the snackbar
    }
  }

  return (
    <div className="space-y-5">
      <RoleHeader
        total={meta.total}
        onAdd={() => { setEditingRole(null); setFormOpen(true) }}
      />
      <RoleSearch query={query} onChange={handleQueryChange} />

      <section className="rounded-xl border border-slate-200 bg-white">
        {roles.length === 0 ? (
          <RoleListState loading={loading} roles={roles} onClear={() => handleQueryChange('')} />
        ) : (
          <RoleTable
            roles={roles}
            onEdit={(role) => { setEditingRole(role); setFormOpen(true) }}
            onDelete={(role) => { setDeletingRole(role); setDeleteOpen(true) }}
          />
        )}
        {meta.total > 0 && (
          <Pagination
            page={meta.page}
            totalPages={meta.last_page}
            totalItems={meta.total}
            pageSize={meta.per_page}
            onPageChange={(nextPage) => { setPage(nextPage); fetchRoles(nextPage, query) }}
          />
        )}
      </section>

      <RoleFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        role={editingRole}
      />

      <DeleteRoleModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        role={deletingRole}
      />
    </div>
  )
}
