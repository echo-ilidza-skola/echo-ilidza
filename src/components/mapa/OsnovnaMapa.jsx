// Leaflet mapa s OpenStreetMap pločicama i obaveznom atribucijom.
// Pločice se učitavaju samo za dio mape koji korisnik gleda (bez predučitavanja).

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Obavezna atribucija OpenStreetMap-a, na izabranom jeziku (koristi se i na mini-mapi na početnoj stranici).
export function osmAtribucija(t) {
  return `&copy; <a href="https://www.openstreetmap.org/copyright">${t('mapa.atribucija')}</a>`
}

export default function OsnovnaMapa({ centar, zoom, className, children, oznaka }) {
  const { jezik, t } = useJezik()
  return (
    <MapContainer
      center={[centar.lat, centar.lng]}
      zoom={zoom}
      className={className}
      aria-label={oznaka}
      zoomControl={false}
    >
      {/* Dugmad za zumiranje s nazivima na bosanskom (za čitač ekrana i tooltip). */}
      {/* key={jezik}: kontrole i sloj se naprave ponovo kad se promijeni jezik, da se prevedu nazivi. */}
      <ZoomControl key={`zum-${jezik}`} position="topleft" zoomInTitle={t('mapa.uvecaj')} zoomOutTitle={t('mapa.umanji')} />
      <TileLayer
        key={`sloj-${jezik}`}
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={osmAtribucija(t)}
        maxZoom={19}
      />
      {children}
    </MapContainer>
  )
}
