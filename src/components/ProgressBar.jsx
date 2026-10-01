export default function ProgressBar({
  value,
  max = 100,
  barColor = 'bg-secondary',
  trackColor = 'bg-secondary-soft',
  height = 'h-2',
  className = '',
  ariaLabel,
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className={`w-full overflow-hidden rounded-full ${trackColor} ${height} ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
