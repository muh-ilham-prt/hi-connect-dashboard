import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function toKey(d) {
  if (!d) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseKey(s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(s) {
  if (!s) return ''
  const d = parseKey(s)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

const PRESETS = [
  { label: 'Hari ini', get: () => { const d = new Date(); return [toKey(d), toKey(d)] } },
  { label: 'Kemarin', get: () => { const d = new Date(); d.setDate(d.getDate() - 1); return [toKey(d), toKey(d)] } },
  { label: '7 hari terakhir', get: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 6); return [toKey(from), toKey(to)] } },
  { label: '30 hari terakhir', get: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29); return [toKey(from), toKey(to)] } },
  { label: 'Bulan ini', get: () => { const now = new Date(); return [toKey(new Date(now.getFullYear(), now.getMonth(), 1)), toKey(now)] } },
]

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const initial = parseKey(endDate) || parseKey(startDate) || new Date()
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [selectingEnd, setSelectingEnd] = useState(false)
  const [tempStart, setTempStart] = useState(startDate)
  const [tempEnd, setTempEnd] = useState(endDate)

  // Sync state when props change
  useEffect(() => {
    setTempStart(startDate)
    setTempEnd(endDate)
  }, [startDate, endDate])

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  function handleSelectDate(dayKey) {
    if (!selectingEnd) {
      setTempStart(dayKey)
      setTempEnd('')
      setSelectingEnd(true)
    } else {
      if (dayKey < tempStart) {
        setTempStart(dayKey)
        setTempEnd(tempStart)
      } else {
        setTempEnd(dayKey)
      }
      setSelectingEnd(false)
    }
  }

  function applyRange(start, end) {
    onChange({ startDate: start, endDate: end })
    setOpen(false)
  }

  function handleApply() {
    const start = tempStart || tempEnd
    const end = tempEnd || tempStart
    if (start && end) {
      applyRange(start <= end ? start : end, start <= end ? end : start)
    }
  }

  // Days matrix for the calendar month
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(toKey(new Date(viewYear, viewMonth, d)))
  }

  const displayText = startDate && endDate
    ? `${formatDisplay(startDate)} — ${formatDisplay(endDate)}`
    : startDate
    ? `${formatDisplay(startDate)} — ...`
    : 'Pilih rentang tanggal'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary/30"
      >
        <Icon icon="lucide:calendar" width="16" className="text-slate-400" />
        <span>{displayText}</span>
        <Icon icon="lucide:chevron-down" width="14" className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          {/* Quick presets */}
          <div className="mb-3 flex flex-wrap gap-1 border-b border-slate-100 pb-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  const [s, e] = p.get()
                  setTempStart(s)
                  setTempEnd(e)
                  applyRange(s, e)
                }}
                className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-secondary-soft hover:text-primary transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Month / Year header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="grid size-7 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Icon icon="lucide:chevron-left" width="16" />
            </button>
            <span className="text-xs font-bold text-slate-700">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="grid size-7 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Icon icon="lucide:chevron-right" width="16" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
            {DAYS.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
            {days.map((dayKey, i) => {
              if (!dayKey) return <div key={i} />
              const dayNum = Number(dayKey.slice(8))
              const isStart = dayKey === tempStart
              const isEnd = dayKey === tempEnd
              const inRange = tempStart && tempEnd && dayKey > tempStart && dayKey < tempEnd

              let cellStyle = 'hover:bg-slate-100 text-slate-700'
              if (isStart || isEnd) {
                cellStyle = 'bg-primary text-white font-bold'
              } else if (inRange) {
                cellStyle = 'bg-secondary-soft text-primary font-medium'
              }

              return (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => handleSelectDate(dayKey)}
                  className={`grid size-8 place-items-center rounded-md transition-colors ${cellStyle}`}
                >
                  {dayNum}
                </button>
              )
            })}
          </div>

          {/* Footer action buttons */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => {
                setTempStart('')
                setTempEnd('')
                applyRange('', '')
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!tempStart}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary disabled:opacity-40 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
