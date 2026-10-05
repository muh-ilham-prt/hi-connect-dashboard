export const initials = (name) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export default function InitialsAvatar({ name, size = 'size-9', className = '' }) {
  return (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-full bg-secondary-soft text-xs font-bold text-primary ${className}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
