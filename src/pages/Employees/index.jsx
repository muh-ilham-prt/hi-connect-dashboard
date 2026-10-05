import { useState, useEffect, useCallback, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useSnackbar } from '@/components/Snackbar'
import Pagination from '@/components/Pagination'
import { http } from '@/helpers/http'
import {
  EmployeeFilter,
  EmployeeTable,
  EmployeeFormModal,
  EmployeeDetailModal,
  DeleteConfirmModal,
} from '@/pages/Employees/components'

const PAGE_SIZE = 10

export default function Employees() {
  const snackbar = useSnackbar()
  const [employees, setEmployees] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 })
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [viewingEmployee, setViewingEmployee] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingEmployee, setDeletingEmployee] = useState(null)

  const debounceRef = useRef(null)

  const fetchEmployees = useCallback(async (p, kw) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE })
      if (kw?.trim()) params.set('keyword', kw.trim())
      const res = await http.get(`/employee?${params}`)
      setEmployees(res.data.data)
      setMeta(res.data.meta)
    } catch {
      // http.js shows snackbar
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEmployees(page, query) }, [fetchEmployees, page])

  function handleQueryChange(v) {
    setQuery(v)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchEmployees(1, v), 400)
  }

  function handlePageChange(p) {
    setPage(p)
  }

  async function handleSave(formData) {
    try {
      if (editingEmployee) {
        await http.put(`/employee/${editingEmployee.id}`, formData)
        snackbar.success('Karyawan berhasil diperbarui')
      } else {
        await http.post('/employee', formData)
        snackbar.success('Karyawan berhasil ditambahkan')
      }
      setFormOpen(false)
      fetchEmployees(page, query)
    } catch {
      // snackbar shown by http.js
    }
  }

  async function handleDelete() {
    if (!deletingEmployee) return
    try {
      await http.delete(`/employee/${deletingEmployee.id}`)
      snackbar.success('Karyawan berhasil dihapus')
      setDeleteOpen(false)
      const newPage = employees.length === 1 && page > 1 ? page - 1 : page
      fetchEmployees(newPage, query)
      setPage(newPage)
    } catch {
      // snackbar shown by http.js
    }
  }

  // Flatten API employee object into form-ready shape for editing
  function flattenEmployee(emp) {
    const d = emp.detail ?? {}
    return {
      name: emp.name ?? '',
      email: emp.email ?? '',
      password: '',
      salary: d.salary ?? '',
      benefits: d.benefits ?? {
        bpjs: false,
        meal: { enabled: false, amount: '' },
        transport: { enabled: false, amount: '' },
        bonus: false,
      },
      nip: d.nip ?? '',
      nik: d.nik ?? '',
      leader_id: d.leader_id ?? '',
      division_id: d.division_id ?? '',
      company_id: d.company_id ?? d.company?.id ?? '',
      job_title: d.job_title ?? '',
      gender: d.gender ?? '',
      phone: d.phone ?? '',
      address: d.address ?? '',
      npwp: d.npwp ?? '',
      can_wfh: d.can_wfh ?? false,
      photo: d.photo ?? '',
      paid_leave_quota: d.paid_leave_quota ?? '',
      status: d.status ?? 'active',
      language: d.language ?? 'id',
      account_bank: d.account_bank ?? '',
      account_name: d.account_name ?? '',
      account_number: d.account_number ?? '',
    }
  }

  function handleOpenEdit(emp) {
    setEditingEmployee({ id: emp.id, ...flattenEmployee(emp) })
    setFormOpen(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Karyawan</h1>
          <p className="text-sm text-slate-500">
            {meta.total} karyawan
          </p>
        </div>
        <button
          onClick={() => { setEditingEmployee(null); setFormOpen(true) }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          <Icon icon="lucide:user-plus" width="18" />
          Tambah karyawan
        </button>
      </div>

      <EmployeeFilter
        query={query}
        onQueryChange={handleQueryChange}
      />

      <section className="rounded-xl border border-slate-200 bg-white">
        <EmployeeTable
          employees={employees}
          loading={loading}
          onEdit={handleOpenEdit}
          onView={setViewingEmployee}
          onDelete={(emp) => { setDeletingEmployee(emp); setDeleteOpen(true) }}
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

      <EmployeeDetailModal
        isOpen={Boolean(viewingEmployee)}
        onClose={() => setViewingEmployee(null)}
        employee={viewingEmployee}
      />

      <EmployeeFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        employee={editingEmployee}
      />

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        employee={deletingEmployee}
      />
    </div>
  )
}
