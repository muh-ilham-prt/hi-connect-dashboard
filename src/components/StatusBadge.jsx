const variants = {
  'On time':  'bg-emerald-50 text-emerald-700',
  'Hadir':     'bg-emerald-50 text-emerald-700',
  'Active':   'bg-emerald-50 text-emerald-700',
  'Approved': 'bg-emerald-50 text-emerald-700',
  'Late':     'bg-amber-50 text-amber-700',
  'On leave': 'bg-amber-50 text-amber-700',
  'Pending':  'bg-amber-50 text-amber-700',
  'Remote':   'bg-secondary-soft text-primary',
  'Absent':   'bg-red-50 text-red-700',
  'Rejected': 'bg-red-50 text-red-700',
  'Leave':    'bg-blue-50 text-blue-700',
  'Inactive': 'bg-slate-100 text-slate-600',
}

export default function StatusBadge({ status, label = status, className = '' }) {
  const labels = { 'On time': 'Tepat waktu', Late: 'Terlambat', Remote: 'Jarak jauh', Absent: 'Tidak hadir', 'On leave': 'Cuti' }
  const variant = variants[status] || 'bg-slate-100 text-slate-700'
  label = label === status ? (labels[status] ?? status) : label
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${variant} ${className}`}>
      {label}
    </span>
  )
}
