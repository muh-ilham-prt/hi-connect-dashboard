import { toast } from '@/components/Snackbar'

const BASE = `${import.meta.env.VITE_API_URL}/dashboard/v1`

// Paths that must never trigger a refresh-and-retry cycle.
const NO_RETRY = new Set(['/auth/login', '/auth/logout', '/auth/refresh-token'])

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Single-flight: concurrent 401s share one refresh request instead of racing.
let refreshPromise = null

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

async function doRefresh() {
  try {
    const res = await fetch(`${BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    })
    if (!res.ok) return null

    const token = (await res.json().catch(() => null))?.data?.token
    if (!token) return null

    localStorage.setItem('token', token)
    return token
  } catch {
    return null
  }
}

async function request(method, path, body, retried = false) {
  let res
  try {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { ...(!isFormData ? { 'Content-Type': 'application/json' } : {}), ...authHeaders() },
      ...(body !== undefined ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    })
  } catch {
    toast.error('Cannot reach the server. Check your connection.')
    const error = new Error('Network error')
    error.status = 0
    throw error
  }

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`)
    error.status = res.status
    error.response = res

    if (res.status === 401) {
      // Access token rejected — try to rotate it once, then replay the request.
      if (!retried && !NO_RETRY.has(path) && (await refreshAccessToken())) {
        return request(method, path, body, true)
      }

      const expired = retried || !NO_RETRY.has(path)
      clearSession()
      if (path !== '/auth/login' && window.location.hash !== '#/') {
        window.location.replace(`${window.location.pathname}${window.location.search}#/`)
        if (expired) toast.error('Your session has expired. Please sign in again.')
      }
    } else {
      const data = await res.clone().json().catch(() => null)
      toast.error(data?.message || `Request failed (${res.status})`)
    }
    throw error
  }

  return res.status === 204 ? null : res.json()
}

export const http = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  put:    (path, body) => request('PUT',    path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  delete: (path)       => request('DELETE', path),
  upload: async (path, formData) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    if (!res.ok) {
      const data = await res.clone().json().catch(() => null)
      toast.error(data?.message || 'Failed to upload image')
      throw new Error(`HTTP ${res.status}`)
    }
    return res.json()
  },
}
