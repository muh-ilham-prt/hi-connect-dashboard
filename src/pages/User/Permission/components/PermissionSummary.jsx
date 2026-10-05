import { ALL_PERMISSION_IDS } from './permissionCatalog'

export default function PermissionSummary({ roleName, permissionCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-secondary/20 bg-secondary-soft/50 px-4 py-3 text-sm">
      <span className="font-semibold text-primary">{roleName}</span>
      <span className="text-slate-600 tabular-nums">
        {permissionCount} dari {ALL_PERMISSION_IDS.length} aksi diaktifkan
      </span>
    </div>
  )
}
