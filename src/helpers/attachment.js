// API base URL; `import.meta.env` is absent outside Vite, so guard it.
const API_URL = (import.meta.env?.VITE_API_URL ?? '').replace(/\/$/, '')

function toAbsoluteUrl(value) {
  const url = String(value ?? '').trim()
  if (!url) return ''
  if (/^(https?:|data:|blob:|\/\/)/i.test(url)) return url
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

// `file_supports` arrives as a string and may hold a plain URL, a JSON array of
// URLs or document objects, or a comma-separated list.
export function attachmentUrls(raw) {
  if (!raw) return []
  let value = raw
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      value = value.split(',')
    }
  }
  const list = Array.isArray(value) ? value : [value]
  return list
    .map((item) => (typeof item === 'string' ? item : item?.url || item?.file_url || item?.path || item?.key || ''))
    .map(toAbsoluteUrl)
    .filter(Boolean)
}

export function isImageUrl(url) {
  return /^data:image\//i.test(url) || /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(url)
}
