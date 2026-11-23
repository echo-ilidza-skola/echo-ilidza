// Mapa na kojoj građanin klikom bira lokaciju problema.

import { useEffect } from 'react'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import OsnovnaMapa from '../mapa/OsnovnaMapa.jsx'
import { CENTAR_MAPE } from '../../data/konstante.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

const IKONA_ODABIRA = L.divIcon({
  className: 'oznaka-omotac',
  html: '<span class="oznaka-odabir" aria-hidden="true"></span>',
  iconSize: [40, 40],
  iconAnchor: [20, 38],
})

// Klik na mapu javlja koordinate.
function SlusacKlika({ naOdabir }) {
  useMapEvents({
    click(e) {
      naOdabir({ lat: e.latlng.lat, lng: e.latlng.lng, izvor: 'mapa' })
    },
  })
  return null
}

// Kad lokacija dođe iz GPS-a ili izbora naselja, pomjerimo mapu do nje.
function PomjeriMapu({ lokacija }) {
  const mapa = useMap()
  useEffect(() => {
    if (lokacija && lokacija.izvor !== 'mapa') {
      mapa.setView([lokacija.lat, lokacija.lng], Math.max(mapa.getZoom(), 16))
    }
  }, [lokacija, mapa])
  return null
}

export default function OdabirLokacije({ lokacija, naOdabir }) {
  const { t } = useJezik()
  return (
    <OsnovnaMapa
      centar={lokacija || CENTAR_MAPE}
      zoom={lokacija ? 16 : 13}
      className="mapa mapa-odabir"
      oznaka={t('obrazacLokacija.mapaOznaka')}
    >
      <SlusacKlika naOdabir={naOdabir} />
      <PomjeriMapu lokacija={lokacija} />
      {lokacija && <Marker position={[lokacija.lat, lokacija.lng]} icon={IKONA_ODABIRA} keyboard={false} />}
    </OsnovnaMapa>
  )
}
