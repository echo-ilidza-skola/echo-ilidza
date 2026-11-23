// Toplotna mapa (biblioteka leaflet.heat): gdje je više prijava i prijavitelja, tamo je "toplije".
// Sloj se dodaje na postojeću Leaflet mapu i uklanja kad se prekidač isključi.

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { HeatLayer } from 'leaflet.heat'
import { tackeToplotneMape } from '../../logic/mapa.js'

// Boje od hladnog (malo prijava) prema toplom (mnogo prijava) su dizajn-tokeni --toplotna-1 … --toplotna-5.
// Biblioteka crta na <canvas>, koji ne razumije CSS varijable, pa njihove vrijednosti čitamo iz CSS-a.
function gradijentIzTokena() {
  const stil = getComputedStyle(document.documentElement)
  const boja = (i) => stil.getPropertyValue(`--toplotna-${i}`).trim()
  return { 0.2: boja(1), 0.45: boja(2), 0.65: boja(3), 0.85: boja(4), 1: boja(5) }
}

export default function ToplotniSloj({ prijave }) {
  const mapa = useMap()
  const slojRef = useRef(null)

  // Sloj se pravi jednom i uklanja kad komponenta nestane (prekidač isključen).
  useEffect(() => {
    // maxZoom 13 = zum na kojem se mapa otvara, pa je toplina tada punom jačinom
    // (biblioteka slabi toplinu na zumovima manjim od maxZoom).
    const sloj = new HeatLayer([], { radius: 38, blur: 26, max: 2, maxZoom: 13, minOpacity: 0.35, gradient: gradijentIzTokena() })
    sloj.addTo(mapa)
    slojRef.current = sloj
    return () => {
      sloj.remove()
      slojRef.current = null
    }
  }, [mapa])

  // Kad se promijene prijave (filteri), samo zamijenimo tačke.
  useEffect(() => {
    slojRef.current?.setLatLngs(tackeToplotneMape(prijave))
  }, [prijave])

  return null
}
