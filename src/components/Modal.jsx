import { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen) {
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`w-[calc(100%-2rem)] ${maxWidth} rounded-2xl p-0 shadow-xl backdrop:bg-slate-900/40 m-auto`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          {title && <h2 className="text-lg font-bold text-primary">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 ml-auto"
            aria-label="Tutup"
          >
            <Icon icon="lucide:x" width="18" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  )
}
