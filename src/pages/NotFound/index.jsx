import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center gap-4">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <p className="text-slate-500">Page not found.</p>
      <Link to="/dashboard" className="text-sm text-primary underline underline-offset-2">Go to dashboard</Link>
    </div>
  )
}
