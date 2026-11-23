// Korak 2: lokacija – GPS (uz dozvolu), klik na mapu ili izbor naselja.
// Kad je lokacija odabrana, prikazuje se kartica sa sažetkom i dugmetom "Promijeni".
// Ručni odabir na mapi UVIJEK radi, i kad GPS nije dostupan.

import { useState } from 'react'
import OdabirLokacije from './OdabirLokacije.jsx'
import Ikona from '../Ikona.jsx'
import { NASELJA } from '../../data/konstante.js'
import { najblizeNaselje } from '../../logic/lokacija.js'
import { upozorenjeLokacije } from '../../logic/validacija.js'
import { porukaGps, razlogNedostupnostiGps } from '../../logic/gps.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Odakle je lokacija: ključ izvora -> ključ teksta u rječniku.
const IZVORI = {
  gps: 'obrazacLokacija.gps',
  mapa: 'obrazacLokacija.mapa',
  naselje: 'obrazacLokacija.naselje',
}

function KarticaLokacije({ lokacija, promijeni, mapaOtvorena }) {
  const { t } = useJezik()
  return (
    <div className="kartica-lokacije">
      <span className="kartica-lokacije-ikona" aria-hidden="true">
        <Ikona ime="mapa" velicina={22} />
      </span>
      <div className="kartica-lokacije-tekst">
        <strong>{t('obrazacLokacija.priblizno', { naselje: najblizeNaselje(lokacija) })}</strong>
        <span className="mali-tekst prigusen">
          {lokacija.lat.toFixed(5)}, {lokacija.lng.toFixed(5)} · {IZVORI[lokacija.izvor] ? t(IZVORI[lokacija.izvor]) : ''}
          {lokacija.izvor === 'gps' && lokacija.tacnost ? t('obrazacLokacija.tacnost', { m: lokacija.tacnost }) : ''}
        </span>
      </div>
      {!mapaOtvorena && (
        <button type="button" className="link-dugme" onClick={promijeni}>
          {t('obrazacLokacija.promijeni')}
        </button>
      )}
    </div>
  )
}

export default function KorakLokacija({ lokacija, postaviLokaciju, greska }) {
  const [gps, postaviGps] = useState({ trazi: false, poruka: null })
  const { jezik, t } = useJezik()
  // Mapa je otvorena dok lokacija nije odabrana; nakon GPS-a se skupi u karticu.
  const [mapaOtvorena, postaviMapuOtvorenu] = useState(!lokacija)

  function koristiGps() {
    const razlog = razlogNedostupnostiGps({
      sigurnaAdresa: window.isSecureContext,
      podrzano: 'geolocation' in navigator,
    })
    if (razlog) {
      postaviGps({ trazi: false, poruka: porukaGps(razlog, undefined, jezik) })
      postaviMapuOtvorenu(true)
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
        postaviMapuOtvorenu(false)
      },
      (greskaGps) => {
        postaviGps({ trazi: false, poruka: porukaGps(greskaGps.code, undefined, jezik) })
        postaviMapuOtvorenu(true)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  }

  function odaberiNaselje(naziv) {
    const naselje = NASELJA.find((n) => n.naziv === naziv)
    if (naselje) postaviLokaciju({ lat: naselje.lat, lng: naselje.lng, izvor: 'naselje' })
  }

  const upozorenje = upozorenjeLokacije(lokacija, jezik)

  return (
    <>
      <button type="button" className="dugme dugme-glavno dugme-gps" onClick={koristiGps} disabled={gps.trazi}>
        <Ikona ime="mapa" velicina={20} />
        {gps.trazi ? t('obrazacLokacija.trazim') : t('obrazacLokacija.koristi')}
      </button>

      {gps.poruka && (
        <p className="upozorenje-okvir" role="status">
          {gps.poruka}
        </p>
      )}

      <div aria-live="polite">
        {lokacija ? (
          <KarticaLokacije lokacija={lokacija} mapaOtvorena={mapaOtvorena} promijeni={() => postaviMapuOtvorenu(true)} />
        ) : (
          <p className="prigusen">{t('obrazacLokacija.nijeOdabrana')}</p>
        )}
        {upozorenje && <p className="upozorenje-okvir">{upozorenje}</p>}
      </div>

      {mapaOtvorena && (
        <div className="lokacija-mapa">
          <p className="uvod-koraka">{t('obrazacLokacija.kliknite')}</p>
          <OdabirLokacije lokacija={lokacija} naOdabir={postaviLokaciju} />
          <div className="polje polje-u-redu">
            <label htmlFor="naselje">{t('obrazacLokacija.poNaselju')}</label>
            <select id="naselje" value="" onChange={(e) => odaberiNaselje(e.target.value)}>
              <option value="">{t('obrazacLokacija.odaberiteNaselje')}</option>
              {NASELJA.map((n) => (
                <option key={n.naziv} value={n.naziv}>
                  {n.naziv}
                </option>
              ))}
            </select>
          </div>
          {lokacija && (
            <button type="button" className="dugme dugme-sporedno dugme-malo" onClick={() => postaviMapuOtvorenu(false)}>
              {t('obrazacLokacija.gotovo')}
            </button>
          )}
        </div>
      )}

      {greska && (
        <p id="lokacija-greska" className="greska-polja" role="alert" tabIndex={-1}>
          {greska}
        </p>
      )}
    </>
  )
}
