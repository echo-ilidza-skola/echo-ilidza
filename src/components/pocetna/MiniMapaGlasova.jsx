// Mala, prava mapa Ilidže (Leaflet + OpenStreetMap) s javnim prijavama kao svijetlećim tačkama.
// Mapa je samo za gledanje: nema zumiranja, povlačenja ni scrolla. Cijela kartica vodi na stranicu Mapa
// (link "Pogledaj mapu" je razvučen preko kartice, vidi .mini-mapa-link u global.css).
// Tamni izgled pravi CSS filter na sloju pločica – pločice su obične OpenStreetMap pločice (bez novog servisa).

import { Link } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import Ikona from '../Ikona.jsx'
import { osmAtribucija } from '../mapa/OsnovnaMapa.jsx'
import { CENTAR_MAPE } from '../../data/konstante.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Sve interakcije s mapom su isključene (mapa se samo gleda).
const BEZ_INTERAKCIJE = {
  dragging: false,
  touchZoom: false,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  boxZoom: false,
  keyboard: false,
  zoomControl: false,
}

// Okvir koji obuhvata sve prijave (ili null ako ih nema).
function okvirPrijava(prijave) {
  if (prijave.length === 0) return null
  return prijave.map((p) => [p.lat, p.lng])
}


// Kartica dobije konačnu veličinu tek nakon prvog prikaza (raspored u tri kolone, pojavljivanje),
// pa mapa ponovo izmjeri svoj okvir i prikaže sve prijave kad god se veličina promijeni.
function PrilagodiPrikaz({ okvir }) {
  const mapa = useMap()
  useEffect(() => {
    function prilagodi() {
      mapa.invalidateSize()
      if (okvir) mapa.fitBounds(okvir, { padding: [18, 18] })
      else mapa.setView([CENTAR_MAPE.lat, CENTAR_MAPE.lng], 12)
    }
    prilagodi()
    const posmatrac = new ResizeObserver(prilagodi)
    posmatrac.observe(mapa.getContainer())
    return () => posmatrac.disconnect()
  }, [mapa, okvir])
  return null
}

export default function MiniMapaGlasova({ javne }) {
  // Okvir se računa ponovo samo kad se promijene prijave.
  const okvir = useMemo(() => okvirPrijava(javne), [javne])
  const { jezik, t } = useJezik()
  return (
    <section className="pocetna-kartica mini-mapa" aria-labelledby="mini-mapa-naslov">
      <h2 id="mini-mapa-naslov">{t('miniMapa.naslov')}</h2>
      <div className="mini-mapa-karta-okvir">
        <MapContainer
          className="mini-mapa-karta"
          {...BEZ_INTERAKCIJE}
          {...(okvir
            ? { bounds: okvir, boundsOptions: { padding: [18, 18] } }
            : { center: [CENTAR_MAPE.lat, CENTAR_MAPE.lng], zoom: 12 })}
          aria-label={t('miniMapa.oznaka', { broj: javne.length })}
        >
          {/* key={jezik}: sloj se napravi ponovo kad se promijeni jezik, da se prevede i atribucija. */}
          <TileLayer
            key={jezik}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={osmAtribucija(t)}
            className="mini-mapa-plocice"
            maxZoom={19}
          />
          <PrilagodiPrikaz okvir={okvir} />
          {javne.map((p) => (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={5}
              interactive={false}
              pathOptions={{ className: 'mini-mapa-tacka', stroke: false, fillOpacity: 1 }}
            />
          ))}
        </MapContainer>
      </div>
      <p className="mini-mapa-tekst">{t('miniMapa.tekst')}</p>
      <Link to="/mapa" className="dugme dugme-glavno mini-mapa-link">
        {t('miniMapa.dugme')}
        <Ikona ime="strelica" velicina={18} />
      </Link>
    </section>
  )
}
