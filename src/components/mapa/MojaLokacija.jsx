// Dugme na mapi: "Prikaži moju lokaciju". Uz dozvolu korisnika preglednik odredi trenutnu lokaciju,
// mapa se pomjeri na nju i tu se nacrta plava tačka s krugom približne tačnosti.
// Lokacija se NIGDJE ne sprema i ne šalje – postoji samo dok je stranica otvorena.
// GPS radi samo na sigurnoj adresi (https ili localhost); inače se jasno kaže zašto ne radi.

import { useEffect, useRef, useState } from 'react'
import { Circle, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import Ikona from '../Ikona.jsx'
import { porukaGps, razlogNedostupnostiGps, DODATAK_ZA_MAPU } from '../../logic/gps.js'

export default function MojaLokacija({ naPoruku }) {
  const mapa = useMap()
  const dugmeRef = useRef(null)
  const [trazi, postaviTrazi] = useState(false)
  const [lokacija, postaviLokaciju] = useState(null) // { lat, lng, tacnost }

  // Klik na dugme ne smije "proći" do mape ispod njega.
  useEffect(() => {
    if (dugmeRef.current) L.DomEvent.disableClickPropagation(dugmeRef.current)
  }, [])

  function prikaziLokaciju() {
    const razlog = razlogNedostupnostiGps({
      sigurnaAdresa: window.isSecureContext,
      podrzano: 'geolocation' in navigator,
    })
    if (razlog) {
      naPoruku(porukaGps(razlog, DODATAK_ZA_MAPU))
      return
    }
    postaviTrazi(true)
    naPoruku('Tražim vašu lokaciju…')
    navigator.geolocation.getCurrentPosition(
      (pozicija) => {
        const nova = {
          lat: pozicija.coords.latitude,
          lng: pozicija.coords.longitude,
          tacnost: Math.round(pozicija.coords.accuracy),
        }
        postaviLokaciju(nova)
        postaviTrazi(false)
        mapa.setView([nova.lat, nova.lng], Math.max(mapa.getZoom(), 15))
        naPoruku(`Prikazana je vaša trenutna lokacija (tačnost oko ${nova.tacnost} m). Lokacija se ne sprema.`)
      },
      (greska) => {
        postaviTrazi(false)
        naPoruku(porukaGps(greska.code, DODATAK_ZA_MAPU))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  }

  return (
    <>
      <div ref={dugmeRef} className="mapa-moja-lokacija leaflet-bar">
        <button
          type="button"
          onClick={prikaziLokaciju}
          disabled={trazi}
          title="Prikaži moju lokaciju"
          aria-label="Prikaži moju lokaciju na mapi"
        >
          <Ikona ime="lokacija" velicina={20} />
        </button>
      </div>
      {lokacija && (
        <>
          <Circle
            center={[lokacija.lat, lokacija.lng]}
            radius={lokacija.tacnost}
            interactive={false}
            pathOptions={{ className: 'moja-lokacija-krug' }}
          />
          <CircleMarker
            center={[lokacija.lat, lokacija.lng]}
            radius={7}
            interactive={false}
            pathOptions={{ className: 'moja-lokacija-tacka' }}
          />
        </>
      )}
    </>
  )
}
