import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Tulis konten di sini...',
  className = '',
}) {
  const editorRef = useRef(null)
  const isInternalChangeRef = useRef(false)
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  })

  // Sync incoming value to editor content if not originating from typing
  useEffect(() => {
    if (!editorRef.current) return
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false
      return
    }
    const currentHtml = editorRef.current.innerHTML
    const nextHtml = value || ''
    if (currentHtml !== nextHtml) {
      editorRef.current.innerHTML = nextHtml
    }
  }, [value])

  function updateActiveFormats() {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      })
    } catch {
      // Ignore unsupported command states
    }
  }

  function exec(command, val = null) {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false, val)
    updateActiveFormats()
    handleInput()
  }

  function handleInput() {
    if (!editorRef.current) return
    isInternalChangeRef.current = true
    const html = editorRef.current.innerHTML
    // Treat empty tags or whitespace as empty string
    const isEmpty = !html || html === '<p><br></p>' || html === '<br>' || html.trim() === ''
    onChange?.(isEmpty ? '' : html)
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  function handleAddLink() {
    const url = window.prompt('Masukkan URL tautan (https://...):')
    if (url) {
      exec('createLink', url)
    }
  }

  const TOOLBAR_BUTTONS = [
    { cmd: 'bold', icon: 'lucide:bold', label: 'Tebal', active: activeFormats.bold },
    { cmd: 'italic', icon: 'lucide:italic', label: 'Miring', active: activeFormats.italic },
    { cmd: 'underline', icon: 'lucide:underline', label: 'Garis bawah', active: activeFormats.underline },
    { cmd: 'strikeThrough', icon: 'lucide:strikethrough', label: 'Coret', active: activeFormats.strikeThrough },
    { type: 'divider' },
    { cmd: 'insertUnorderedList', icon: 'lucide:list', label: 'Daftar berpoin', active: activeFormats.insertUnorderedList },
    { cmd: 'insertOrderedList', icon: 'lucide:list-ordered', label: 'Daftar bernomor', active: activeFormats.insertOrderedList },
    { type: 'divider' },
    { type: 'link', icon: 'lucide:link', label: 'Sisipkan tautan', action: handleAddLink },
    { cmd: 'removeFormat', icon: 'lucide:remove-formatting', label: 'Hapus pemformatan' },
  ]

  return (
    <div className={`rounded-lg border border-slate-300 bg-white focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/30 transition-all ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/70 p-1.5 rounded-t-lg">
        {TOOLBAR_BUTTONS.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key={idx} className="mx-1 h-4 w-px bg-slate-200" />
          }
          if (item.type === 'link') {
            return (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className="grid size-7 place-items-center rounded text-slate-600 hover:bg-slate-200/70 hover:text-primary transition-colors"
                title={item.label}
                aria-label={item.label}
              >
                <Icon icon={item.icon} width="14" />
              </button>
            )
          }
          return (
            <button
              key={idx}
              type="button"
              onClick={() => exec(item.cmd)}
              className={`grid size-7 place-items-center rounded text-slate-600 transition-colors ${
                item.active
                  ? 'bg-secondary-soft text-primary font-bold shadow-xs'
                  : 'hover:bg-slate-200/70 hover:text-primary'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon icon={item.icon} width="14" />
            </button>
          )
        })}
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Prosedur operasional standar"
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        data-placeholder={placeholder}
        className="min-h-[140px] max-h-[260px] overflow-y-auto px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
      />
    </div>
  )
}
