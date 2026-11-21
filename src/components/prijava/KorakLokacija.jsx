// Korak 2: lokacija klikom na mapu, GPS-om (uz dozvolu) ili izborom naselja.
// Ručni odabir UVIJEK radi, i kad GPS nije dostupan.

import { useState } from 'react'
import OdabirLokacije from './OdabirLokacije.jsx'
import Ikona from '../Ikona.jsx'
import { NASELJA } from '../../data/konstante.js'
import { najblizeNaselje } from '../../logic/lokacija.js'
import { upozorenjeLokacije } from '../../logic/validacija.js'
import { porukaGps, razlogNedostupnostiGps } from '../../logic/gps.js'

export default function KorakLokacija({ lokacija, postaviLokaciju, greska }) {
  const [gps, postaviGps] = useState({ trazi: false, poruka: null })

  function koristiGps() {
    const razlog = razlogNedostupnostiGps({
      sigurnaAdresa: window.isSecureContext,
      podrzano: 'geolocation' in navigator,
    })
    if (razlog) {
      postaviGps({ trazi: false, poruka: porukaGps(razlog) })
      return
    }
    postaviGps({ trazi: true, poruka: null })
    navigator.geolocation.getCurrentPosition(
      (pozicija) => {
        postaviLokaciju({
          lat: pozicija.coords.latitude,
          lng: pozicija.coords.longitude,
          izvor: 'gps',
          tacnost: Math.round(pozicija.coords.accuracy),
        })
        postaviGps({ trazi: false, poruka: null })
      },
      (greskaGps) => postaviGps({ trazi: false, poruka: porukaGps(greskaGps.code) }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  }

  function odaberiNaselje(naziv) {
    const naselje = NASELJA.find((n) => n.naziv === naziv)
    if (naselje) postaviLokaciju({ lat: naselje.lat, lng: naselje.lng, izvor: 'naselje' })
  }

  const upozorenje = upozorenjeLokacije(lokacija)

  return (
    <>
      <p className="uvod-koraka">Kliknite na mapu tačno na mjesto problema. Lokaciju možete mijenjati novim klikom.</p>

      <div className="lokacija-alati">
        <button type="button" className="dugme dugme-sporedno" onClick={koristiGps} disabled={gps.trazi}>
          <Ikona ime="mapa" velicina={18} />
          {gps.trazi ? 'Tražim lokaciju…' : 'Koristi moju lokaciju'}
        </button>

        <div className="polje polje-u-redu">
          <label htmlFor="naselje">ili približno, po naselju:</label>
          <select id="naselje" value="" onChange={(e) => odaberiNaselje(e.target.value)}>
            <option value="">– Odaberite naselje –</option>
            {NASELJA.map((n) => (
              <option key={n.naziv} value={n.naziv}>
                {n.naziv}
              </option>
            ))}
          </select>
        </div>
      </div>

      {gps.poruka && (
        <p className="upozorenje-okvir" role="status">
          {gps.poruka}
        </p>
      )}

      <OdabirLokacije lokacija={lokacija} naOdabir={postaviLokaciju} />

      <div aria-live="polite">
        {lokacija ? (
          <p className="odabrana-lokacija">
            <Ikona ime="kvacica" velicina={18} />
            Odabrano: približno naselje <strong>{najblizeNaselje(lokacija)}</strong> ({lokacija.lat.toFixed(5)},{' '}
            {lokacija.lng.toFixed(5)})
            {lokacija.izvor === 'gps' && lokacija.tacnost ? `, GPS tačnost oko ${lokacija.tacnost} m` : ''}
            {lokacija.izvor === 'naselje' ? ' – središte naselja; kliknite na mapu za tačnije mjesto' : ''}
          </p>
        ) : (
          <p className="prigusen">Lokacija još nije odabrana.</p>
        )}
        {upozorenje && <p className="upozorenje-okvir">{upozorenje}</p>}
      </div>

      {greska && (
        <p id="lokacija-greska" className="greska-polja" role="alert" tabIndex={-1}>
          {greska}
        </p>
      )}
    </>
  )
}
