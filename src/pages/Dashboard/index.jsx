import { useEffect, useMemo, useState } from 'react'
import { http } from '@/helpers/http'
import { AttendanceCharts, DepartmentRates, KpiGrid, LatestCheckIns } from '@/pages/Dashboard/components'

const formatDay = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short' })
const formatDate = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dateRange(daysCount) {
  const to = new Date()
  const cursor = new Date(to)
  let workingDays = 0
  while (workingDays < daysCount) {
    if (cursor.getDay() % 6 !== 0) workingDays += 1
    if (workingDays < daysCount) cursor.setDate(cursor.getDate() - 1)
  }
  return { from: dateKey(cursor), to: dateKey(to) }
}

const emptySummary = {
  period: {},
  summary: { total_employees: 0, present: 0, late: 0, absent: 0, on_leave: 0, attendance_rate: 0 },
  comparison: { present: 0, late: 0, absent: 0, on_leave: 0 },
  daily: [],
  check_in_buckets: [],
  department_rates: [],
  latest_check_ins: [],
}

export default function Dashboard() {
  const [range, setRange] = useState(5)
  const [dashboard, setDashboard] = useState(emptySummary)
  const [loading, setLoading] = useState(true)
  const period = useMemo(() => dateRange(range), [range])

  useEffect(() => {
    let active = true
    setLoading(true)
    http.get(`/attendance-summary?from=${period.from}&to=${period.to}&timezone=Asia%2FJakarta`)
      .then((response) => {
        if (active) setDashboard({ ...emptySummary, ...(response?.data ?? {}) })
      })
      .catch(() => {
        if (active) setDashboard(emptySummary)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [period])

  const { summary, comparison } = dashboard
  const cards = [
    { label: 'Hadir', value: summary.present, sub: `${summary.attendance_rate}% dari ${summary.total_employees}`, icon: 'lucide:user-check', delta: null },
    { label: 'Terlambat', value: summary.late, icon: 'lucide:alarm-clock', delta: comparison.late },
    { label: 'Tidak hadir', value: summary.absent, icon: 'lucide:user-x', delta: comparison.absent },
    { label: 'Cuti', value: summary.on_leave, icon: 'lucide:tree-palm', delta: comparison.on_leave },
  ]
  const days = dashboard.daily.map((day) => ({ ...day, date: new Date(`${day.date}T00:00:00`) }))
  const buckets = dashboard.check_in_buckets.map((bucket) => ({
    label: bucket.start,
    value: bucket.count,
    late: bucket.late,
  }))
  const departments = dashboard.department_rates.map((department) => [department.name, department.rate])
  const rows = dashboard.latest_check_ins.map((checkIn) => [
    checkIn.employee?.name,
    checkIn.employee?.department,
    checkIn.check_in?.slice(0, 5),
    checkIn.location,
    checkIn.status,
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Analitik absensi</h1>
          <p className="text-sm text-slate-500">{formatDate.format(new Date())}</p>
        </div>
        <label className="text-sm text-slate-600">
          <span className="sr-only">Rentang tanggal</span>
          <select
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
          >
            <option value={5}>Minggu ini</option>
            <option value={10}>10 hari kerja terakhir</option>
            <option value={20}>20 hari kerja terakhir</option>
          </select>
        </label>
      </div>

      {loading ? <p className="text-sm text-slate-500">Memuat analitik absensi...</p> : (
        <>
          <KpiGrid cards={cards} />
          <AttendanceCharts days={days} buckets={buckets} formatDay={formatDay} />
          <div className="grid gap-6 xl:grid-cols-5">
            <DepartmentRates departments={departments} />
            <LatestCheckIns rows={rows} />
          </div>
        </>
      )}
    </div>
  )
}
