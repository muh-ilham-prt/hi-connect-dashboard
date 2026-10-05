import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function AuthGuard() {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function GuestGuard() {
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
