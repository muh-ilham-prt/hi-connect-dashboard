import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'

// Searchable dropdown. Options: [{ value, label }]
export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih opsi',
  loading = false,
  loadingText = 'Memuat...',
  emptyText = 'Tidak ada hasil',
  onSearch,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const searchTimerRef = useRef(null)

  const selected = options.find((o) => o.value === value)
  const q = query.trim().toLowerCase()
  const filtered = onSearch ? options : q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
  }, [open])

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function choose(option) {
    onChange(option.value)
    setOpen(false)
  }

  function onKeyDown(e) {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) choose(filtered[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation() // don't let the native <dialog> swallow Escape
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
          open ? 'border-secondary' : 'border-slate-300'
        }`}
      >
        <span className={`flex-1 truncate ${selected ? 'text-slate-800' : 'text-slate-400'}`}>
          {selected ? selected.label : loading ? loadingText : placeholder}
        </span>
        <Icon
          icon="lucide:chevron-down"
          width="16"
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="relative border-b border-slate-100">
            <Icon
              icon="lucide:search"
              width="16"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => {
                const val = e.target.value
                setQuery(val)
                setActive(0)
                if (onSearch) {
                  clearTimeout(searchTimerRef.current)
                  searchTimerRef.current = setTimeout(() => onSearch(val), 300)
                }
              }}
              onKeyDown={onKeyDown}
              placeholder="Cari..."
              aria-label="Cari opsi"
              className="w-full py-2.5 pl-9 pr-3 text-sm focus:outline-none"
            />
          </div>

          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-400">{emptyText}</li>
            ) : (
              filtered.map((o, i) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                    i === active ? 'bg-secondary-soft text-primary' : 'text-slate-700'
                  }`}
                >
                  <span className="flex-1 truncate">{o.label}</span>
                  {o.value === value && <Icon icon="lucide:check" width="16" className="shrink-0" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
