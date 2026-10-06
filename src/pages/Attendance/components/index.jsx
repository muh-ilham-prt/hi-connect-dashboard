import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import InitialsAvatar from '@/components/InitialsAvatar'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import SearchSelect from '@/components/SearchSelect'
import DateRangePicker from '@/components/DateRangePicker'
import { http } from '@/helpers/http'

const API_URL = (import.meta.env?.VITE_API_URL ?? '').replace(/\/$/, '')

function imageUrl(path) {
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

function AttendancePhoto({ src }) {
  const [url, setUrl] = useState('')

  if (!src) return <div className="flex min-h-40 items-center justify-center text-slate-400"><Icon icon="lucide:image-off" width="32" /></div>

  useEffect(() => {
    let active = true
    const token = localStorage.getItem('token')
    fetch(imageUrl(src), { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.blob()
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob)
        if (active) setUrl(objectUrl)
        else URL.revokeObjectURL(objectUrl)
      })
      .catch(() => {})
    return () => {
      active = false
      setUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return ''
      })
    }
  }, [src])

  return url ? <img src={url} alt="Foto absensi" className="w-full max-h-72 object-cover" /> : <div className="flex min-h-40 items-center justify-center text-slate-400"><Icon icon="lucide:image-off" width="32" /></div>
}

// ---- Filter bar ----
function useFilterOptions(endpoint) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  async function search(keyword) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: 1, per_page: 100 })
      if (keyword?.trim()) params.set('keyword', keyword.trim())
      const res = await http.get(`${endpoint}?${params}`)
      const items = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []
      setOptions(items.map((item) => ({ value: item.id, label: item.name })))
    } catch {
      // http.js shows the snackbar; keep existing options
    } finally {
      setLoading(false)
    }
  }

  return { options, loading, search }
}

export function AttendanceFilter({ query, onQueryChange, employeeId, onEmployeeChange, divisionId, onDivisionChange, noCheckInOnly, onNoCheckInChange }) {
  const employees = useFilterOptions('/employee')
  const divisions = useFilterOptions('/division')

  useEffect(() => {
    employees.search('')
    divisions.search('')
  }, [])

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1.3fr)_minmax(13rem,1fr)_minmax(13rem,1fr)]">
      <div className="relative">
        <Icon
          icon="lucide:search"
          width="16"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari nama, NIP, atau email"
          aria-label="Cari absensi"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>
      <SearchSelect
        value={employeeId}
        onChange={onEmployeeChange}
        options={[{ value: '', label: 'Semua karyawan' }, ...employees.options]}
        loading={employees.loading}
        onSearch={employees.search}
        placeholder="Semua karyawan"
        loadingText="Memuat karyawan..."
      />
      <SearchSelect
        value={divisionId}
        onChange={onDivisionChange}
        options={[{ value: '', label: 'Semua divisi' }, ...divisions.options]}
        loading={divisions.loading}
        onSearch={divisions.search}
        placeholder="Semua divisi"
        loadingText="Memuat divisi..."
      />
      <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={noCheckInOnly}
          onChange={(e) => onNoCheckInChange(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Belum check-in
      </label>
    </div>
  )
}

export function DateNav({ startDate, endDate, onChange }) {
  return <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
}

// ---- Attendance table ----
export function AttendanceTable({ records, loading, onViewDetail, onClearFilters }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
        <Icon icon="lucide:loader-2" width="20" className="animate-spin text-primary" />
        <span>Memuat absensi...</span>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <Icon icon="lucide:calendar-search" width="36" height="36" className="mx-auto text-slate-300" />
        <p className="mt-2 font-semibold text-slate-800">Data absensi tidak ditemukan</p>
        <p className="text-sm text-slate-500">Coba kata kunci atau rentang tanggal lain.</p>
        <button
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
        >
          Hapus filter
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Karyawan</th>
            <th className="px-3 py-3 font-semibold">Tanggal</th>
            <th className="px-3 py-3 font-semibold">Masuk</th>
            <th className="px-3 py-3 font-semibold">Status</th>
            <th className="px-3 py-3 font-semibold">Keluar</th>
            <th className="px-3 py-3 font-semibold">Jarak</th>
            <th className="px-5 py-3 text-right font-semibold">Foto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((rec) => (
            <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={rec.employee?.name ?? '?'} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{rec.employee?.name ?? '-'}</p>
                    <p className="truncate text-xs text-slate-500">{rec.employee?.detail?.nip ?? rec.employee?.email ?? '-'}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-slate-700 tabular-nums">
                {rec.date ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(rec.date)) : '-'}
              </td>
              <td className="px-3 py-3 tabular-nums text-slate-700">{rec.check_in ? rec.check_in.slice(0, 5) : '-'}</td>
              <td className="px-3 py-3">
                <StatusBadge status={rec.late_status ? 'Late' : 'On time'} label={rec.late_status ? 'Terlambat' : 'Tepat waktu'} className="text-xs" />
              </td>
              <td className="px-3 py-3 tabular-nums">
                {rec.check_out ? (
                  <span className="text-slate-700">{rec.check_out.slice(0, 5)}</span>
                ) : (
                  <StatusBadge status="Active" label="Aktif" className="text-xs" />
                )}
              </td>
              <td className="px-3 py-3 text-slate-600">{rec.distance ? `${rec.distance} m` : '-'}</td>
              <td className="px-5 py-3 text-right">
                {rec.photo ? (
                  <button
                    onClick={() => onViewDetail(rec)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-secondary-soft hover:text-primary hover:border-secondary transition-colors"
                  >
                    <Icon icon="lucide:image" width="14" />
                    Lihat foto
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Tidak ada foto</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---- Attendance detail modal ----
export function AttendanceDetailModal({ isOpen, onClose, record }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail absensi" maxWidth="max-w-lg">
      {record ? (
        <div className="space-y-4">
          {/* Photo */}
          {record.photo ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(record.photo).map(([type, src]) => (
                <div key={type} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <p className="border-b border-slate-200 px-3 py-2 text-xs font-semibold capitalize text-slate-600">{type}</p>
                  <AttendancePhoto src={src} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-10 text-slate-400">
              <Icon icon="lucide:image-off" width="32" />
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Karyawan</p>
              <p className="mt-0.5 font-semibold text-slate-800">{record.employee?.name ?? '-'}</p>
              <p className="text-xs text-slate-500">{record.employee?.email ?? ''}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tanggal</p>
              <p className="mt-0.5 text-slate-800">
                {record.date ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(record.date)) : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Masuk</p>
              <p className="mt-0.5 font-semibold text-slate-800">{record.check_in?.slice(0, 5) ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Keterlambatan</p>
              <p className={`mt-0.5 font-semibold ${record.late_status ? 'text-amber-600' : 'text-emerald-600'}`}>{record.late_status ? `Terlambat (${record.late_status})` : 'Tepat waktu'}</p>
            </div>
            {record.late_reason && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Alasan keterlambatan</p>
                <p className="mt-0.5 text-slate-800">{record.late_reason}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Keluar</p>
              <p className="mt-0.5 font-semibold text-slate-800">{record.check_out?.slice(0, 5) ?? 'Masih bekerja'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Jarak</p>
              <p className="mt-0.5 text-slate-800">{record.distance ? `${record.distance} m` : '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Lokasi</p>
              {record.latitude && record.longitude ? (
                <a
                  href={`https://maps.google.com/?q=${record.latitude},${record.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 flex items-center gap-1 text-primary hover:underline"
                >
                  <Icon icon="lucide:map-pin" width="12" />
                  Buka di Maps
                </a>
              ) : (
                <p className="mt-0.5 text-slate-800">-</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
