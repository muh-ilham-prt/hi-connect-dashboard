import { Icon } from '@iconify/react'
import { ACTIONS, LEAF_MENUS, MENU_PERMISSIONS, permId } from './permissionCatalog'

export default function PermissionMatrix({ permissions, onChange }) {
  function toggle(menuId, action) {
    const id = permId(menuId, action)
    onChange(
      permissions.includes(id)
        ? permissions.filter((permission) => permission !== id)
        : [...permissions, id],
    )
  }

  function toggleColumn(action) {
    const columnIds = LEAF_MENUS.map((menu) => permId(menu.id, action))
    const allChecked = columnIds.every((id) => permissions.includes(id))
    onChange(
      allChecked
        ? permissions.filter((permission) => !columnIds.includes(permission))
        : [...new Set([...permissions, ...columnIds])],
    )
  }

  function toggleRow(menuId) {
    const rowIds = ACTIONS.map((action) => permId(menuId, action.key))
    const allChecked = rowIds.every((id) => permissions.includes(id))
    onChange(
      allChecked
        ? permissions.filter((permission) => !rowIds.includes(permission))
        : [...new Set([...permissions, ...rowIds])],
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50/70">
          <tr>
            <th className="px-5 py-3">Menu</th>
            {ACTIONS.map((action) => {
              const columnIds = LEAF_MENUS.map((menu) => permId(menu.id, action.key))
              const checkedCount = columnIds.filter((id) => permissions.includes(id)).length
              const allChecked = checkedCount === columnIds.length
              const someChecked = checkedCount > 0 && !allChecked
              return (
                <th key={action.key} className="px-3 py-3 text-center">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-slate-700 hover:text-primary">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(element) => { if (element) element.indeterminate = someChecked }}
                      onChange={() => toggleColumn(action.key)}
                      className="size-4 rounded accent-secondary cursor-pointer"
                      aria-label={`Pilih semua izin ${action.label}`}
                    />
                    <span>{action.label}</span>
                  </label>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MENU_PERMISSIONS.map((item) => {
            if (item.parent) {
              return (
                <tr key={item.id} className="bg-slate-50/90 font-semibold text-slate-700">
                  <td colSpan={6} className="px-5 py-2.5 text-xs uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-2">
                      <Icon icon={item.icon} width="16" className="text-slate-400" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                </tr>
              )
            }

            const rowIds = ACTIONS.map((action) => permId(item.id, action.key))
            const rowCheckedCount = rowIds.filter((id) => permissions.includes(id)).length
            const isChild = Boolean(item.group)

            return (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3">
                  <div className={`flex items-center gap-2.5 ${isChild ? 'pl-6' : ''}`}>
                    {isChild && <span className="text-slate-300 text-xs font-mono select-none">└</span>}
                    <Icon icon={item.icon} width="16" className="text-slate-400 shrink-0" />
                    <button
                      type="button"
                      onClick={() => toggleRow(item.id)}
                      className="text-left font-medium text-slate-800 hover:text-primary hover:underline"
                      title="Klik untuk memilih semua izin pada menu ini"
                    >
                      {item.name}
                    </button>
                  </div>
                </td>
                {ACTIONS.map((action) => (
                  <td key={action.key} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={permissions.includes(permId(item.id, action.key))}
                      onChange={() => toggle(item.id, action.key)}
                      className="size-4 rounded accent-secondary cursor-pointer"
                      aria-label={`${item.name} - ${action.label}`}
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
