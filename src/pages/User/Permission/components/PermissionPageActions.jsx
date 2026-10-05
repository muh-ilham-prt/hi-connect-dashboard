import { Icon } from '@iconify/react'

export default function PermissionPageActions({ saving, onCancel, onSave }) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Batal
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary disabled:opacity-60"
      >
        <Icon icon={saving ? 'lucide:loader-2' : 'lucide:save'} width="16" className={saving ? 'animate-spin' : ''} />
        {saving ? 'Saving...' : 'Save permissions'}
      </button>
    </div>
  )
}
