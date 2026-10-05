import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = {
  'application/pdf': { icon: 'lucide:file-text', label: 'PDF', ext: '.pdf' },
  'application/msword': { icon: 'lucide:file-text', label: 'DOC', ext: '.doc' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: 'lucide:file-text', label: 'DOCX', ext: '.docx' },
  'application/vnd.ms-excel': { icon: 'lucide:file-spreadsheet', label: 'XLS', ext: '.xls' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: 'lucide:file-spreadsheet', label: 'XLSX', ext: '.xlsx' },
}
const ALLOWED_EXT_RE = /\.(pdf|doc|docx|xls|xlsx)$/i

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(type) {
  return ALLOWED_TYPES[type]?.icon ?? 'lucide:file'
}

function fileLabel(type) {
  return ALLOWED_TYPES[type]?.label ?? 'Berkas'
}

// Each item in `files` is either:
//   { _file: File, name, size, type }          – newly selected, not yet uploaded
//   { key, url, name, size, type }             – already uploaded (from office data)

export default function FileDropzone({ files = [], onChange, uploading = false }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState([])

  function validate(incoming) {
    const errs = []
    const valid = []
    for (const f of incoming) {
      if (!ALLOWED_EXT_RE.test(f.name) && !ALLOWED_TYPES[f.type]) {
        errs.push(`"${f.name}": jenis berkas tidak didukung`)
        continue
      }
      if (f.size > MAX_SIZE) {
        errs.push(`"${f.name}": melebihi batas 10 MB (${formatBytes(f.size)})`)
        continue
      }
      valid.push({ _file: f, name: f.name, size: f.size, type: f.type || 'application/octet-stream' })
    }
    return { valid, errs }
  }

  function addFiles(incoming) {
    const { valid, errs } = validate(Array.from(incoming))
    setErrors(errs)
    if (valid.length) onChange([...files, ...valid])
  }

  function remove(idx) {
    setErrors([])
    onChange(files.filter((_, i) => i !== idx))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full rounded-lg border-2 border-dashed px-4 py-5 text-center text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 ${
          dragging
            ? 'border-secondary bg-secondary-soft text-primary'
            : 'border-slate-300 bg-white text-slate-500 hover:border-secondary hover:bg-slate-50'
        }`}
        disabled={uploading}
      >
        <Icon
          icon={dragging ? 'lucide:folder-open' : 'lucide:upload-cloud'}
          width="28"
          className={`mx-auto mb-1.5 ${dragging ? 'text-secondary' : 'text-slate-400'}`}
        />
        <span className="font-semibold text-slate-700">Seret berkas ke sini</span> atau{' '}
        <span className="font-semibold text-secondary">pilih berkas</span>
        <p className="mt-1 text-xs text-slate-400">PDF, DOC, DOCX, XLS, XLSX — maks. 10 MB per berkas</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        className="sr-only"
        onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
        disabled={uploading}
      />

      {/* Errors */}
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((msg, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-red-600">
              <Icon icon="lucide:circle-alert" width="13" className="mt-0.5 shrink-0" />
              {msg}
            </li>
          ))}
        </ul>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((item, idx) => (
            <li
              key={item.key ?? item.name + idx}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <Icon icon={fileIcon(item.type)} width="18" className="shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">
                  {fileLabel(item.type)} · {formatBytes(item.size)}
                  {item._file && <span className="ml-1 italic">menunggu diunggah</span>}
                </p>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-7 shrink-0 place-items-center rounded text-slate-400 hover:bg-slate-200 hover:text-primary transition-colors"
                  title="Buka berkas"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="lucide:external-link" width="14" />
                </a>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                disabled={uploading}
                className="grid size-7 shrink-0 place-items-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                title="Hapus"
                aria-label={`Hapus ${item.name}`}
              >
                <Icon icon="lucide:x" width="14" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
