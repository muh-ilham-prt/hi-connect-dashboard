import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom SVG marker pin so we don't depend on Leaflet image asset URLs in Vite
const pinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <path fill="#1a2e75" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  <circle cx="12" cy="9" r="3" fill="#ffffff"/>
</svg>
`

const customIcon = L.divIcon({
  html: pinSvg,
  className: 'leaflet-pin-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

export default function MapPicker({
  lat,
  lng,
  radius = 10,
  radiusUnit = 'meter',
  onChange,
  height = '260px',
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const circleRef = useRef(null)

  const defaultLat = -6.3171809
  const defaultLng = 106.6871455

  const currentLat = Number.isFinite(parseFloat(lat)) ? parseFloat(lat) : defaultLat
  const currentLng = Number.isFinite(parseFloat(lng)) ? parseFloat(lng) : defaultLng
  const currentRadius = radiusUnit === 'kilometer' ? Number(radius || 0) * 1000 : Number(radius || 0)

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [currentLat, currentLng],
      zoom: 16,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([currentLat, currentLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map)

    const circle = L.circle([currentLat, currentLng], {
      radius: currentRadius > 0 ? currentRadius : 10,
      color: '#1a2e75',
      fillColor: '#425aad',
      fillOpacity: 0.18,
      weight: 2,
    }).addTo(map)

    function updatePos(newLat, newLng) {
      marker.setLatLng([newLat, newLng])
      circle.setLatLng([newLat, newLng])
      onChange({ lat: newLat.toFixed(7), lng: newLng.toFixed(7) })
    }

    map.on('click', (e) => {
      updatePos(e.latlng.lat, e.latlng.lng)
    })

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      updatePos(pos.lat, pos.lng)
    })

    mapRef.current = map
    markerRef.current = marker
    circleRef.current = circle

    // Force redraw on mount/modal display
    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      circleRef.current = null
    }
  }, [])

  // Sync position from outside (e.g. manual text inputs or geolocation)
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current) return
    const pos = [currentLat, currentLng]
    markerRef.current.setLatLng(pos)
    circleRef.current.setLatLng(pos)
    circleRef.current.setRadius(currentRadius > 0 ? currentRadius : 10)
    mapRef.current.setView(pos, mapRef.current.getZoom())
  }, [currentLat, currentLng, currentRadius])

  // Invalidate size on re-render in case parent container resized
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 100)
    }
  })

  return (
    <div className="space-y-1.5">
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full overflow-hidden rounded-lg border border-slate-200 shadow-inner z-0"
      />
      <p className="text-[11px] text-slate-500">
        Klik titik pada peta atau geser penanda untuk menentukan lokasi kantor dan radius check-in.
      </p>
    </div>
  )
}
