import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Icon } from '@iconify/react'

const SnackbarContext = createContext(null)

const icons = {
  success: 'lucide:check-circle-2',
  error:   'lucide:alert-circle',
  warning: 'lucide:alert-triangle',
  info:    'lucide:info',
}

const styles = {
  success: 'bg-emerald-600 text-white',
  error:   'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info:    'bg-slate-800 text-white',
}

// Standalone toast instance for non-React contexts (e.g. http.js)
let globalToast = null

export const toast = {
  show:    (...args) => globalToast?.show(...args),
  success: (...args) => globalToast?.success(...args),
  error:   (...args) => globalToast?.error(...args),
  warning: (...args) => globalToast?.warning(...args),
  info:    (...args) => globalToast?.info(...args),
}

export function SnackbarProvider({ children }) {
  const [snackbars, setSnackbars] = useState([])

  const remove = useCallback((id) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const show = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()
    setSnackbars((prev) => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }, [remove])

  const api = {
    show,
    success: (msg, dur) => show(msg, 'success', dur),
    error:   (msg, dur) => show(msg, 'error', dur),
    warning: (msg, dur) => show(msg, 'warning', dur),
    info:    (msg, dur) => show(msg, 'info', dur),
  }

  useEffect(() => {
    globalToast = api
    return () => { globalToast = null }
  }, [api])

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {snackbars.map((s) => (
          <div
            key={s.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-200 ${styles[s.type] || styles.info}`}
            role="alert"
          >
            <Icon icon={icons[s.type] || icons.info} width="18" height="18" className="shrink-0" />
            <span className="flex-1">{s.message}</span>
            <button
              onClick={() => remove(s.id)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
              aria-label="Close notification"
            >
              <Icon icon="lucide:x" width="14" height="14" />
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar must be used within a SnackbarProvider')
  return ctx
}
