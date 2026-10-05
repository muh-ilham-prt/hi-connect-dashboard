import { Icon } from '@iconify/react'
import ProgressBar from '@/components/ProgressBar'
import StatusBadge from '@/components/StatusBadge'

export function KpiGrid({ cards }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Today at a glance">
      {cards.map(({ label, value, sub, delta, icon }) => (
        <article key={label} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            {label}
            <span className="grid size-9 place-items-center rounded-lg bg-secondary-soft text-secondary">
              <Icon icon={icon} width="18" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-primary">{value}</p>
          <p className="mt-1 text-xs">
            {delta === null ? (
              <span className="text-slate-500">{sub}</span>
            ) : (
              <>
                <span className={delta > 0 ? 'text-red-600' : 'text-emerald-600'}>
                  {delta > 0 ? '+' : ''}{delta}
                </span>
                <span className="text-slate-500"> vs yesterday</span>
              </>
            )}
          </p>
        </article>
      ))}
    </section>
  )
}

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      <h2 className="font-bold text-primary">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      {children}
    </section>
  )
}

export function AttendanceCharts({ days, buckets, formatDay }) {
  const width = 640, height = 240
  const pad = { left: 32, right: 8, top: 12, bottom: 28 }
  const max = Math.ceil(Math.max(...days.flatMap(({ late, absent }) => [late, absent])) / 8) * 8
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom
  const groupWidth = innerWidth / days.length
  const barWidth = Math.min(18, groupWidth * 0.32)
  const timeWidth = 400, timeHeight = 240
  const timePad = { left: 8, right: 8, top: 16, bottom: 28 }
  const timeMax = Math.max(...buckets.map(({ value }) => value))
  const timeInnerHeight = timeHeight - timePad.top - timePad.bottom
  const timeGroupWidth = (timeWidth - timePad.left - timePad.right) / buckets.length
  const markerX = timePad.left + timeGroupWidth * 4

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <ChartCard title="Late and absent per day" className="xl:col-span-3">
        <div className="mt-2 flex justify-end gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-[#9fb0e3]" />Late</span>
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-primary" />Absent</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-auto w-full" role="img" aria-label="Grouped bar chart of late and absent employees per day">
          {[0, 1, 2, 3, 4].map((step) => {
            const value = (max / 4) * step
            const y = pad.top + innerHeight - (value / max) * innerHeight
            return <g key={step}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#e2e8f0" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{Math.round(value)}</text>
            </g>
          })}
          {days.map((day, index) => {
            const center = pad.left + groupWidth * index + groupWidth / 2
            return <g key={day.date.toISOString()}>
              {[
                { value: day.late, color: '#9fb0e3', offset: -barWidth - 1 },
                { value: day.absent, color: '#1a2e75', offset: 1 },
              ].map(({ value, color, offset }) => {
                const barHeight = (value / max) * innerHeight
                return <rect key={color} x={center + offset} y={pad.top + innerHeight - barHeight} width={barWidth} height={barHeight} rx="3" fill={color}>
                  <title>{formatDay.format(day.date)}: {value}</title>
                </rect>
              })}
              {(days.length <= 10 || index % 2 === 0) && <text x={center} y={height - 8} textAnchor="middle" fontSize="11" fill="#64748b">{formatDay.format(day.date)}</text>}
            </g>
          })}
        </svg>
      </ChartCard>

      <ChartCard title="Check-in times today" subtitle="Arrivals in 15-minute groups. Shift starts at 08:00." className="xl:col-span-2">
        <svg viewBox={`0 0 ${timeWidth} ${timeHeight}`} className="mt-4 h-auto w-full" role="img" aria-label="Histogram of check-in times today">
          {buckets.map((bucket, index) => {
            const barHeight = (bucket.value / timeMax) * timeInnerHeight
            const x = timePad.left + timeGroupWidth * index + 3
            return <g key={bucket.label}>
              <rect x={x} y={timePad.top + timeInnerHeight - barHeight} width={timeGroupWidth - 6} height={barHeight} rx="3" fill={bucket.late ? '#9fb0e3' : '#1a2e75'}>
                <title>{bucket.label}: {bucket.value} check-ins</title>
              </rect>
              {index % 3 === 0 && <text x={x + (timeGroupWidth - 6) / 2} y={timeHeight - 8} textAnchor="middle" fontSize="11" fill="#64748b">{bucket.label}</text>}
            </g>
          })}
          <line x1={markerX} x2={markerX} y1={timePad.top - 6} y2={timePad.top + timeInnerHeight} stroke="#425aad" strokeDasharray="4 3" />
          <text x={markerX + 5} y={timePad.top + 2} fontSize="11" fill="#425aad">08:00</text>
        </svg>
      </ChartCard>
    </div>
  )
}

export function DepartmentRates({ departments }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
      <h2 className="font-bold text-primary">Attendance rate by department</h2>
      <ul className="mt-4 space-y-4">
        {departments.map(([name, rate]) => (
          <li key={name}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium">{name}</span>
              <span className="tabular-nums text-slate-500">{rate}%</span>
            </div>
            <ProgressBar value={rate} ariaLabel={`${name} attendance ${rate}%`} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function LatestCheckIns({ rows }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-primary">Latest check-ins</h2>
        <a href="#/attendance" className="text-sm font-semibold text-secondary hover:text-primary">View all attendance</a>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="py-2 font-semibold">Employee</th>
              <th className="py-2 font-semibold">Check-in</th>
              <th className="py-2 font-semibold">Location</th>
              <th className="py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(([name, department, time, location, status]) => (
              <tr key={`${name}-${time}`}>
                <td className="py-3"><p className="font-semibold">{name}</p><p className="text-xs text-slate-500">{department}</p></td>
                <td className="py-3 tabular-nums">{time}</td>
                <td className="py-3 text-slate-600">{location}</td>
                <td className="py-3"><StatusBadge status={status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
