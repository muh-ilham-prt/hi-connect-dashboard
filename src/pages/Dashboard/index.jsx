import { useState } from 'react'
import { AttendanceCharts, DepartmentRates, KpiGrid, LatestCheckIns } from './components'

const TOTAL = 248
const seeded = (index) => {
  const value = Math.sin(index * 12.9898) * 43758.5453
  return value - Math.floor(value)
}
const formatDay = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' })
const formatDate = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

function buildDays(daysCount) {
  const result = []
  const cursor = new Date()
  let step = 0
  while (result.length < daysCount) {
    if (cursor.getDay() % 6 !== 0) {
      const key = step++
      result.unshift({
        date: new Date(cursor),
        late: Math.round(12 + seeded(key + 1) * 16),
        absent: Math.round(5 + seeded(key + 9) * 9),
        leave: Math.round(4 + seeded(key + 17) * 8),
      })
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return result
}

function getBuckets() {
  const result = []
  for (let index = 0; index < 10; index++) {
    const minutes = 7 * 60 + index * 15
    const peak = Math.exp(-Math.pow((index - 3.2) / 1.7, 2))
    result.push({
      label: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
      value: Math.round(peak * 70 + seeded(index + 3) * 8),
      late: minutes >= 8 * 60,
    })
  }
  return result
}

const departments = [
  ['Operations', 96.4],
  ['Sales', 94.1],
  ['Finance', 97.8],
  ['Engineering', 92.5],
  ['Customer support', 89.7],
]

const recentRows = [
  ['Siti Rahmawati', 'Finance', '07:52', 'Head office', 'On time'],
  ['Budi Santoso', 'Operations', '07:58', 'Warehouse A', 'On time'],
  ['Rina Wulandari', 'Sales', '08:14', 'Head office', 'Late'],
  ['Agus Prasetyo', 'Engineering', '08:02', 'Remote', 'Remote'],
  ['Dewi Lestari', 'Customer support', '08:21', 'Branch Depok', 'Late'],
  ['Fajar Nugroho', 'Operations', '07:47', 'Warehouse B', 'On time'],
]

export default function Dashboard() {
  const [range, setRange] = useState(5)
  const days = buildDays(range)
  const today = days[days.length - 1]
  const prev = days[days.length - 2] || today
  const present = TOTAL - today.absent - today.leave
  const buckets = getBuckets()

  const cards = [
    { label: 'Present', value: present, sub: `${Math.round((present / TOTAL) * 100)}% of ${TOTAL}`, icon: 'lucide:user-check', delta: null },
    { label: 'Late', value: today.late, icon: 'lucide:alarm-clock', delta: today.late - prev.late },
    { label: 'Absent', value: today.absent, icon: 'lucide:user-x', delta: today.absent - prev.absent },
    { label: 'On leave', value: today.leave, icon: 'lucide:tree-palm', delta: today.leave - prev.leave },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Attendance analytics</h1>
          <p className="text-sm text-slate-500">{formatDate.format(new Date())}</p>
        </div>
        <label className="text-sm text-slate-600">
          <span className="sr-only">Date range</span>
          <select
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
          >
            <option value={5}>This week</option>
            <option value={10}>Last 10 working days</option>
            <option value={20}>Last 20 working days</option>
          </select>
        </label>
      </div>

      <KpiGrid cards={cards} />
      <AttendanceCharts days={days} buckets={buckets} formatDay={formatDay} />
      <div className="grid gap-6 xl:grid-cols-5">
        <DepartmentRates departments={departments} />
        <LatestCheckIns rows={recentRows} />
      </div>
    </div>
  )
}
