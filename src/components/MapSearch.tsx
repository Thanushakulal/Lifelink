"use client"
import { useEffect, useRef, useState } from 'react'
import { mapsApiKey } from '@/lib/firebase'
import { useTranslation } from 'react-i18next'

type HospitalLite = {
  name: string
  place_id: string
  address?: string
}

export default function MapSearch({ onSelect }: { onSelect?: (h: HospitalLite) => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [radiusKm, setRadiusKm] = useState<5 | 10>(5)
  useEffect(() => {
    if (!mapsApiKey || !ref.current) return

    let map: google.maps.Map | null = null
    let userMarker: google.maps.Marker | null = null

    const init = async () => {
      try {
        const hasGoogle = typeof window !== 'undefined' && (window as any).google && (window as any).google.maps
        if (!hasGoogle) {
          await loadGoogleScript(mapsApiKey!)
        }
        const center = { lat: 12.9716, lng: 77.5946 } // Bengaluru
        map = new google.maps.Map(ref.current as HTMLElement, {
          center,
          zoom: 13,
          mapId: 'lifelink-map',
        })
        // No geolocation: always search around default center
        searchNearby(center)
      } catch (e) {
        setError('Map failed to load')
      }
    }

    const searchNearby = (location: google.maps.LatLngLiteral) => {
      if (!map) return
      const svc = new google.maps.places.PlacesService(map)
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius: radiusKm * 1000,
        keyword: 'hospital',
        type: 'hospital',
      }
      setLoading(true)
      svc.nearbySearch(request, (res: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
        setLoading(false)
        if (status !== google.maps.places.PlacesServiceStatus.OK || !res) return
        setResults(res)
        res.forEach((place: google.maps.places.PlaceResult) => {
          if (!place.geometry || !place.geometry.location) return
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map!,
            title: place.name,
          })
          marker.addListener('click', () => handleSelect(place, map!))
        })
      })
    }

    init()

    return () => {
      // Cleanup
      if (userMarker) userMarker.setMap(null)
      map = null
    }
  }, [radiusKm])

  const handleSelect = (place: google.maps.places.PlaceResult, map?: google.maps.Map) => {
    if (!onSelect) return
    const svc = new google.maps.places.PlacesService(map || (ref.current ? new google.maps.Map(ref.current) : undefined)!)
    if (place.place_id) {
      const detailsReq: google.maps.places.PlaceDetailsRequest = {
        placeId: place.place_id,
        fields: ['name', 'place_id', 'formatted_address']
      }
      svc.getDetails(detailsReq, (det, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && det) {
          onSelect({ name: det.name || place.name || '', place_id: det.place_id || place.place_id || '', address: det.formatted_address || undefined })
        } else {
          onSelect({ name: place.name || '', place_id: place.place_id || '', address: undefined })
        }
      })
    } else {
      onSelect({ name: place.name || '', place_id: '', address: undefined })
    }
  }
  return (
    <div className="card p-4">
      <h3 className="text-xl font-bold mb-2">{t('nearby_hospitals_title')}</h3>
      <p className="mb-3 text-sm opacity-80">{t('nearby_hospitals_desc')}</p>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span>Radius:</span>
        <select
          className="input h-9 w-24"
          value={radiusKm}
          onChange={(e) => {
            const v = Number(e.target.value) === 10 ? 10 : 5
            setRadiusKm(v as 5 | 10)
          }}
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
        </select>
      </div>
      <div ref={ref} className="h-64 rounded-xl bg-slate-100" />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3">
        {loading && <p className="text-sm opacity-70">Loading…</p>}
        {results.length > 0 && (
          <ul className="space-y-2 max-h-44 overflow-auto mt-2">
            {results.map((p) => {
              const loc = p.geometry?.location
              const latlng = loc ? { lat: loc.lat(), lng: loc.lng() } : null
              const mapsUrl = p.place_id
                ? `https://www.google.com/maps/search/?api=1&query=${latlng?.lat},${latlng?.lng}&query_place_id=${p.place_id}`
                : latlng
                ? `https://www.google.com/maps/search/?api=1&query=${latlng.lat},${latlng.lng}`
                : undefined
              return (
                <li key={p.place_id || p.name} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="truncate opacity-80">{p.vicinity || ''}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                        Open in Maps
                      </a>
                    )}
                    <button type="button" className="btn btn-sm" onClick={() => handleSelect(p)}>
                      Select
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function loadGoogleScript(apiKey: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-ggl="maps"]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      if ((window as any).google && (window as any).google.maps) return resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`
    script.async = true
    script.defer = true
    script.dataset.ggl = 'maps'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}
