// Udaljenost između dvije tačke na Zemlji (haversine formula).

export const POLUPRECNIK_ZEMLJE_M = 6371000 // R = 6371 km

function uRadijane(stepeni) {
  return (stepeni * Math.PI) / 180
}

// Vraća udaljenost u metrima između tačaka { lat, lng }.
export function udaljenostM(a, b) {
  const dLat = uRadijane(b.lat - a.lat)
  const dLng = uRadijane(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(uRadijane(a.lat)) * Math.cos(uRadijane(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * POLUPRECNIK_ZEMLJE_M * Math.asin(Math.min(1, Math.sqrt(h)))
}
