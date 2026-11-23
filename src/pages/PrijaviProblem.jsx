// Obrazac "Prijavi problem" u 3 koraka: 1 Opis → 2 Lokacija → 3 Pregled i slanje.
// Nova prijava ima status "Na čekanju provjere" i NE pojavljuje se na javnoj mapi.

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import TrakaKoraka from '../components/prijava/TrakaKoraka.jsx'
import KorakOpis from '../components/prijava/KorakOpis.jsx'
import KorakLokacija from '../components/prijava/KorakLokacija.jsx'
import KorakPregled from '../components/prijava/KorakPregled.jsx'
import StatusOznaka from '../components/StatusOznaka.jsx'
import Ikona from '../components/Ikona.jsx'
import TrakaStranice from '../components/TrakaStranice.jsx'
import { DEMO_KORISNIK_ID } from '../data/konstante.js'
import { dodajPrijavu, javnePrijave, sacuvajFotografiju, obrisiFotografiju } from '../data/storage.js'
import { provjeriOsnovno, provjeriLokaciju, imaGresaka } from '../logic/validacija.js'
import { pronadjiMoguceDuplikate } from '../logic/duplikati.js'
import { pripremiFotografiju } from '../utils/slike.js'
import { tekstGreske } from '../jezik/greska.js'
import { useJezik } from '../jezik/JezikContext.jsx'

const PRAZAN_UNOS = { naslov: '', opis: '', kategorija: '' }

export default function PrijaviProblem() {
  const [korak, postaviKorak] = useState(1)
  const [unos, postaviUnos] = useState(PRAZAN_UNOS)
  const { jezik, t } = useJezik()
  const [lokacija, postaviLokaciju] = useState(null)
  const [foto, postaviFoto] = useState(null) // { blob, url, sirina, visina }
  const [fotoObrada, postaviFotoObradu] = useState(false)
  const [fotoGreska, postaviFotoGresku] = useState(null)
  const [greske, postaviGreske] = useState({})
  const [salje, postaviSalje] = useState(false)
  const [greskaSlanja, postaviGreskuSlanja] = useState(null)
  const [poslana, postaviPoslanu] = useState(null) // { prijava, glavna }
  const naslovRef = useRef(null)

  // Kad se promijeni korak: fokus na naslov koraka (za tastaturu i čitač ekrana) i na vrh stranice.
  const prviPrikaz = useRef(true)
  useEffect(() => {
    if (prviPrikaz.current) {
      prviPrikaz.current = false
      return
    }
    window.scrollTo({ top: 0 })
    naslovRef.current?.focus()
  }, [korak, poslana])

  // Oslobodi memoriju privremenog URL-a fotografije kad se fotografija zamijeni ili ukloni.
  useEffect(() => {
    return () => {
      if (foto) URL.revokeObjectURL(foto.url)
    }
  }, [foto])

  function promijeni(polje, vrijednost) {
    postaviUnos((stari) => ({ ...stari, [polje]: vrijednost }))
    if (greske[polje]) postaviGreske((stare) => ({ ...stare, [polje]: undefined }))
  }

  async function odaberiFotografiju(fajl) {
    postaviFotoGresku(null)
    postaviFotoObradu(true)
    try {
      const { blob, sirina, visina } = await pripremiFotografiju(fajl)
      postaviFoto({ blob, url: URL.createObjectURL(blob), sirina, visina })
    } catch (e) {
      postaviFotoGresku(e)
    } finally {
      postaviFotoObradu(false)
    }
  }

  function dalje() {
    const nove = korak === 1 ? provjeriOsnovno(unos, jezik) : provjeriLokaciju(lokacija, jezik)
    postaviGreske(nove)
    if (imaGresaka(nove)) {
      // Fokus na prvo neispravno polje.
      const prvo = Object.keys(nove)[0]
      document.getElementById(prvo === 'lokacija' ? 'lokacija-greska' : prvo)?.focus()
      return
    }
    postaviKorak(korak + 1)
  }

  // Mogući duplikati: SAMO među javnim prijavama, da se ne otkriju neodobrene prijave.
  const javne = korak === 3 ? javnePrijave() : []
  const duplikati =
    korak === 3
      ? pronadjiMoguceDuplikate({ kategorija: unos.kategorija, lat: lokacija.lat, lng: lokacija.lng }, javne)
          .map((d) => ({ prijava: javne.find((p) => p.id === d.prijavaId), udaljenostM: d.udaljenostM }))
          .filter((d) => d.prijava)
      : []

  async function posalji(glavnaPrijavaId) {
    postaviSalje(true)
    postaviGreskuSlanja(null)
    let fotografijaId = null
    try {
      if (foto) fotografijaId = await sacuvajFotografiju(foto.blob)
      const prijava = dodajPrijavu(
        { ...unos, lat: lokacija.lat, lng: lokacija.lng, fotografijaId, glavnaPrijavaId },
        DEMO_KORISNIK_ID,
      )
      const glavna = glavnaPrijavaId ? javne.find((p) => p.id === glavnaPrijavaId) : null
      postaviPoslanu({ prijava, glavna })
    } catch (e) {
      // Ako je fotografija spremljena, a prijava nije, obrišemo fotografiju da ne ostane "siroče".
      if (fotografijaId) obrisiFotografiju(fotografijaId)
      postaviGreskuSlanja(e)
    } finally {
      postaviSalje(false)
    }
  }

  function novaPrijava() {
    postaviUnos(PRAZAN_UNOS)
    postaviLokaciju(null)
    postaviFoto(null)
    postaviGreske({})
    postaviPoslanu(null)
    postaviKorak(1)
  }

  if (poslana) {
    return (
      <>
        <TrakaStranice naslov={t('nav.prijavi')} />
        <section className="obrazac-stranica">
          <div className="kartica uspjeh">
            <span className="uspjeh-ikona" aria-hidden="true">
              <Ikona ime="kvacica" velicina={40} />
            </span>
            <h2 ref={naslovRef} tabIndex={-1}>
              {t('obrazac.poslana')}
            </h2>
            <p>
              {t('obrazac.status')} <StatusOznaka status={poslana.prijava.status} />
            </p>
            <p>{t('obrazac.napomenaJavnost')}</p>
            {poslana.glavna && (
              <p>
                {t('obrazac.povezanaPoslana', { naslov: poslana.glavna.naslov, broj: poslana.glavna.brojPrijavitelja + 1 })}
              </p>
            )}
            <div className="obrazac-dugmad">
              <Link to="/moje-prijave" className="dugme dugme-glavno">
                {t('nav.moje')}
              </Link>
              <button type="button" className="dugme dugme-sporedno" onClick={novaPrijava}>
                {t('moje.novaPrijava')}
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <TrakaStranice naslov={t('nav.prijavi')} />
      <section className="obrazac-stranica">
        <TrakaKoraka trenutni={korak} />

        <div className="kartica obrazac">
          <h2 ref={naslovRef} tabIndex={-1} className="naslov-koraka">
            {t('obrazac.korakNaslov', { broj: korak, naziv: t(`obrazac.koraci.${korak}`) })}
          </h2>

          {korak === 1 && (
            <KorakOpis
              unos={unos}
              promijeni={promijeni}
              greske={greske}
              fotografija={{
                foto,
                obrada: fotoObrada,
                greska: tekstGreske(fotoGreska, jezik),
                odaberi: odaberiFotografiju,
                ukloni: () => postaviFoto(null),
              }}
            />
          )}

          {korak === 2 && (
            <KorakLokacija
              lokacija={lokacija}
              postaviLokaciju={(l) => {
                postaviLokaciju(l)
                postaviGreske({})
              }}
              greska={greske.lokacija}
            />
          )}

          {korak === 3 && (
            <KorakPregled
              unos={unos}
              lokacija={lokacija}
              foto={foto}
              ukloniFoto={() => postaviFoto(null)}
              duplikati={duplikati}
              idiNaKorak={postaviKorak}
              posalji={posalji}
              salje={salje}
              greska={tekstGreske(greskaSlanja, jezik)}
            />
          )}

          {korak < 3 && (
            <div className="obrazac-dugmad">
              {korak > 1 && (
                <button type="button" className="dugme" onClick={() => postaviKorak(korak - 1)}>
                  {t('obrazac.nazad')}
                </button>
              )}
              <button type="button" className="dugme dugme-glavno" onClick={dalje} disabled={fotoObrada}>
                {t('obrazac.dalje')}
                <Ikona ime="strelica" velicina={18} className="ikona-strelica" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
