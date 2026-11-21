// Leaflet mapa s OpenStreetMap pločicama i obaveznom atribucijom.
// Pločice se učitavaju samo za dio mape koji korisnik gleda (bez predučitavanja).

import { MapContainer, TileLayer } from 'react-leaflet'

const OSM_ATRIBUCIJA =
  '&copy; <a href="https://www.openstreetmap.org/copyright">saradnici OpenStreetMap-a</a>'

export default function OsnovnaMapa({ centar, zoom, className, children, oznaka }) {
  return (
    <MapContainer
      center={[centar.lat, centar.lng]}
      zoom={zoom}
      className={className}
      aria-label={oznaka}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={OSM_ATRIBUCIJA}
        maxZoom={19}
      />
      {children}
    </MapContainer>
  )
}
