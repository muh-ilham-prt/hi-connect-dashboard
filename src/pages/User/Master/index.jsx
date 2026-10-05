import { useState, useEffect, useCallback, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useSnackbar } from '@/components/Snackbar'
import { http } from '@/helpers/http'
import Pagination from '@/components/Pagination'
import {
  UserFilter,
  UserTable,
  UserFormModal,
  ResetPasswordModal,
  DeleteUserModal,
} from '@/pages/User/Master/components'

const PAGE_SIZE = 10

export default function UserMaster() {
  const snackbar = useSnackbar()
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 })
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [resettingUser, setResettingUser] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null)

  // Debounce keyword so we don't fire on every keystroke
  const debounceRef = useRef(null)

  const fetchUsers = useCallback(async (p, kw) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE })
      if (kw?.trim()) params.set('keyword', kw.trim())
      const res = await http.get(`/user?${params}`)
      setUsers(res.data.data)
      setMeta(res.data.meta)
    } catch {
      // http.js already shows a snackbar
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers(page, query) }, [fetchUsers, page])

  function handleQueryChange(v) {
    setQuery(v)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchUsers(1, v), 400)
  }

  function handlePageChange(p) {
    setPage(p)
    fetchUsers(p, query)
  }

  async function handleSave(formData) {
    try {
      if (editingUser) {
        await http.put(`/user/${editingUser.id}`, formData)
        snackbar.success('Pengguna berhasil diperbarui')
      } else {
        await http.post('/user', formData)
        snackbar.success('Pengguna berhasil ditambahkan')
      }
      setFormOpen(false)
      fetchUsers(page, query)
    } catch {
      // snackbar shown by http.js
    }
  }

  async function handleResetPassword(password) {
    try {
      await http.put(`/user/${resettingUser.id}/change-password`, { password })
      snackbar.success(`Kata sandi berhasil diubah untuk ${resettingUser.name}`)
      setResetOpen(false)
    } catch {
      // snackbar shown by http.js
    }
  }

  async function handleDelete() {
    if (!deletingUser) return
    try {
      await http.delete(`/user/${deletingUser.id}`)
      snackbar.success('Pengguna berhasil dihapus')
      setDeleteOpen(false)
      // if last item on page, go back one
      const newPage = users.length === 1 && page > 1 ? page - 1 : page
      fetchUsers(newPage, query)
      setPage(newPage)
    } catch {
      // snackbar shown by http.js
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Semua pengguna</h1>
          <p className="text-sm text-slate-500">
            {meta.total} akun terdaftar
          </p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setFormOpen(true) }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          <Icon icon="lucide:user-plus" width="18" />
          Tambah pengguna
        </button>
      </div>

      <UserFilter
        query={query}
        onQueryChange={handleQueryChange}
      />

      <section className="rounded-xl border border-slate-200 bg-white">
        <UserTable
          users={users}
          loading={loading}
          onEdit={(u) => { setEditingUser(u); setFormOpen(true) }}
          onResetPassword={(u) => { setResettingUser(u); setResetOpen(true) }}
          onDelete={(u) => { setDeletingUser(u); setDeleteOpen(true) }}
          onClearFilters={() => handleQueryChange('')}
        />
        {meta.total > 0 && (
          <Pagination
            page={meta.page}
            totalPages={meta.last_page}
            totalItems={meta.total}
            pageSize={meta.per_page}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      <UserFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        user={editingUser}
      />

      <ResetPasswordModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleResetPassword}
        user={resettingUser}
      />

      <DeleteUserModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        user={deletingUser}
      />
    </div>
  )
}
