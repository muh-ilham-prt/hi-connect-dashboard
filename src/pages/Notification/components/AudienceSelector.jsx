import { Icon } from '@iconify/react'
import InitialsAvatar from '@/components/InitialsAvatar'

export default function AudienceSelector({
  options,
  divisions,
  audience,
  selectedDivisions,
  selectedEmployees,
  employees,
  filteredEmployees,
  searchEmployees,
  onAudienceChange,
  onDivisionToggle,
  onEmployeeToggle,
  onEmployeeSearch,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Target Penerima</label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = audience === option.id
          return (
            <button key={option.id} type="button" onClick={() => onAudienceChange(option.id)} className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${active ? 'border-secondary bg-secondary-soft text-primary ring-2 ring-secondary/30' : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'}`}>
              <div className="flex items-center gap-2"><Icon icon={option.icon} width="16" className={active ? 'text-secondary' : 'text-slate-400'} /><span className="text-sm font-semibold">{option.label}</span></div>
              <span className="mt-1 text-xs leading-tight text-slate-400">{option.desc}</span>
            </button>
          )
        })}
      </div>

      {audience === 'division' && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <span className="mb-2 block text-xs font-semibold text-slate-700">Pilih Divisi:</span>
          <div className="flex flex-wrap gap-2">
            {divisions.map((division) => {
              const checked = selectedDivisions.includes(division)
              return <button key={division} type="button" onClick={() => onDivisionToggle(division)} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${checked ? 'bg-secondary text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}><Icon icon={checked ? 'lucide:check' : 'lucide:plus'} width="12" />{division}</button>
            })}
          </div>
        </div>
      )}

      {audience === 'individual' && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <span className="mb-2 block text-xs font-semibold text-slate-700">Pilih Karyawan ({selectedEmployees.length} dipilih):</span>
          <div className="relative mb-2">
            <Icon icon="lucide:search" width="14" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" value={searchEmployees} onChange={(event) => onEmployeeSearch(event.target.value)} placeholder="Cari nama karyawan..." aria-label="Cari nama karyawan" className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>
          <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {filteredEmployees.length === 0 ? <p className="py-3 text-center text-xs text-slate-400">Karyawan tidak ditemukan.</p> : filteredEmployees.map((employee) => {
              const checked = selectedEmployees.includes(employee.id)
              return <label key={employee.id} onClick={() => onEmployeeToggle(employee.id)} className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-1.5 transition ${checked ? 'border-secondary/50 bg-secondary-soft' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                <div className="flex items-center gap-2"><InitialsAvatar name={employee.name} size="size-8" /><div><p className="text-xs font-semibold text-slate-800">{employee.name}</p><p className="text-[10px] text-slate-400">{employee.division}</p></div></div>
                <input type="checkbox" checked={checked} onChange={() => {}} className="rounded text-secondary focus:ring-secondary" />
              </label>
            })}
          </div>
        </div>
      )}
    </div>
  )
}
