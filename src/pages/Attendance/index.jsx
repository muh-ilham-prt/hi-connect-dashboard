import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { useSnackbar } from '@/components/Snackbar'
import Pagination from '@/components/Pagination'
import { http } from '@/helpers/http'
import {
  AttendanceDetailModal,
  AttendanceFilter,
  AttendanceTable,
  DateNav,
} from '@/pages/Attendance/components'

const PAGE_SIZE = 10

function todayKey() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dateKeyOffset(offset) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatTime(time) {
  return time ? time.slice(0, 5) : ''
}

const escCell = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default function Attendance() {
  const snackbar = useSnackbar()
  const today = useMemo(todayKey, [])
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [query, setQuery] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [divisionId, setDivisionId] = useState('')
  const [noCheckInOnly, setNoCheckInOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: PAGE_SIZE, total: 0, last_page: 1 })
  const [loading, setLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailRecord, setDetailRecord] = useState(null)
  const debounceRef = useRef(null)

  const fetchAttendance = useCallback(async (p, keyword, from, to, empId, divId) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, per_page: PAGE_SIZE })
      if (keyword?.trim()) params.set('keyword', keyword.trim())
      if (from) params.set('start_date', from)
      if (to) params.set('end_date', to)
      if (empId) params.set('employee_id', empId)
      if (divId) params.set('division_id', divId)
      const res = await http.get(`/attendance?${params}`)
      const payload = res.data ?? {}
      setRecords(payload.data ?? [])
      setMeta(payload.meta ?? { page: p, per_page: PAGE_SIZE, total: 0, last_page: 1 })
    } catch {
      // http.js shows the snackbar
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAttendance(page, query, startDate, endDate, employeeId, divisionId)
  }, [fetchAttendance, page, startDate, endDate, employeeId, divisionId])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  function handleQueryChange(value) {
    setQuery(value)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => fetchAttendance(1, value, startDate, endDate, employeeId, divisionId),
      400,
    )
  }

  function handleEmployeeChange(value) {
    setEmployeeId(value)
    setPage(1)
  }

  function handleDivisionChange(value) {
    setDivisionId(value)
    setPage(1)
  }

  function handleNoCheckInChange(value) {
    setNoCheckInOnly(value)
  }

  function handleDateRangeChange(range) {
    setStartDate(range.startDate)
    setEndDate(range.endDate)
    setPage(1)
  }

  function handleViewDetail(record) {
    setDetailRecord(record)
    setDetailOpen(true)
  }

  const visibleRecords = noCheckInOnly ? records.filter((record) => !record.check_in) : records

  function handleExport() {
    const header = ['Karyawan', 'Email', 'Tanggal', 'Masuk', 'Keluar', 'Jarak (m)', 'Latitude', 'Longitude']
    const rows = visibleRecords.map((record) => [
      record.employee?.name,
      record.employee?.email,
      record.date,
      formatTime(record.check_in),
      formatTime(record.check_out),
      record.distance,
      record.latitude,
      record.longitude,
    ])
    const tableRows = [header, ...rows]
      .map((row, index) => `<tr>${row.map((cell) => `<${index ? 'td' : 'th'}>${escCell(cell)}</${index ? 'td' : 'th'}>`).join('')}</tr>`)
      .join('')
    const workbook = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table>${tableRows}</table></body></html>`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8' }))
    link.download = `absensi-${startDate}-${endDate}.xls`
    link.click()
    URL.revokeObjectURL(link.href)
    snackbar.success('Data absensi berhasil diekspor ke Excel')
  }

  function clearFilters() {
    setQuery('')
    setStartDate('')
    setEndDate('')
    setEmployeeId('')
    setDivisionId('')
    setNoCheckInOnly(false)
    setPage(1)
  }

  const dateLabel = startDate && endDate && startDate === endDate
    ? new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${startDate}T00:00:00`))
    : 'Pilih rentang tanggal'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Absensi</h1>
          <p className="text-sm text-slate-500">{dateLabel} · Hari ini {today}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateNav
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
          <button
            onClick={handleExport}
            disabled={visibleRecords.length === 0}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <Icon icon="lucide:download" width="18" />
            Ekspor Excel
          </button>
        </div>
      </div>

      <AttendanceFilter
        query={query}
        onQueryChange={handleQueryChange}
        employeeId={employeeId}
        onEmployeeChange={handleEmployeeChange}
        divisionId={divisionId}
        onDivisionChange={handleDivisionChange}
        noCheckInOnly={noCheckInOnly}
        onNoCheckInChange={handleNoCheckInChange}
      />

      <section className="rounded-xl border border-slate-200 bg-white">
        <AttendanceTable
          records={visibleRecords}
          loading={loading}
          onViewDetail={handleViewDetail}
          onClearFilters={clearFilters}
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

      <AttendanceDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={detailRecord}
      />
    </div>
  )
}
