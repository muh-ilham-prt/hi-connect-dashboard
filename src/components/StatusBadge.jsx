const variants = {
  'On time': 'bg-emerald-50 text-emerald-700',
  'Late': 'bg-amber-50 text-amber-700',
  'Remote': 'bg-secondary-soft text-primary',
  'Absent': 'bg-red-50 text-red-700',
  'Leave': 'bg-blue-50 text-blue-700',
}

export default function StatusBadge({ status, className = '' }) {
  const variant = variants[status] || 'bg-slate-100 text-slate-700'
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${variant} ${className}`}>
      {status}
    </span>
  )
}
