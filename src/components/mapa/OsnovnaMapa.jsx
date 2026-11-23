// Leaflet mapa s OpenStreetMap pločicama i obaveznom atribucijom.
// Pločice se učitavaju samo za dio mape koji korisnik gleda (bez predučitavanja).

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'

// Obavezna atribucija OpenStreetMap-a (koristi se i na mini-mapi na početnoj stranici).
export const OSM_ATRIBUCIJA =
  '&copy; <a href="https://www.openstreetmap.org/copyright">saradnici OpenStreetMap-a</a>'

export default function OsnovnaMapa({ centar, zoom, className, children, oznaka }) {
  return (
    <MapContainer
      center={[centar.lat, centar.lng]}
      zoom={zoom}
      className={className}
      aria-label={oznaka}
      zoomControl={false}
    >
      {/* Dugmad za zumiranje s nazivima na bosanskom (za čitač ekrana i tooltip). */}
      <ZoomControl position="topleft" zoomInTitle="Uvećaj mapu" zoomOutTitle="Umanji mapu" />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={OSM_ATRIBUCIJA}
        maxZoom={19}
      />
      {children}
    </MapContainer>
  )
}
