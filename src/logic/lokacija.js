// Pravila za lokaciju: približni okvir Ilidže i najbliže naselje.
// Koordinate su aproksimacija, ne zvanične granice općine.

import { OKVIR_ILIDZE, NASELJA } from '../data/konstante.js'
import { udaljenostM } from './udaljenost.js'

// Da li je tačka unutar približnog okvira Ilidže (rubovi se računaju kao unutra).
// Lokacija izvan okvira dobija upozorenje, ali se NE blokira.
export function jeUOkviruIlidze(tacka) {
  if (!tacka || !Number.isFinite(tacka.lat) || !Number.isFinite(tacka.lng)) return false
  return (
    tacka.lat >= OKVIR_ILIDZE.minLat &&
    tacka.lat <= OKVIR_ILIDZE.maxLat &&
    tacka.lng >= OKVIR_ILIDZE.minLng &&
    tacka.lng <= OKVIR_ILIDZE.maxLng
  )
}

// Naziv naselja čije je PRIBLIŽNO središte najbliže tački.
export function najblizeNaselje(tacka) {
  let najblize = null
  let najmanja = Infinity
  for (const naselje of NASELJA) {
    const d = udaljenostM(tacka, naselje)
    if (d < najmanja) {
      najmanja = d
      najblize = naselje.naziv
    }
  }
  return najblize
}
