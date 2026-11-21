// Obrazac "Prijavi problem" u 3 koraka: 1 Opis → 2 Lokacija → 3 Pregled i slanje.
// Nova prijava ima status "Na čekanju provjere" i NE pojavljuje se na javnoj mapi.

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import TrakaKoraka from '../components/prijava/TrakaKoraka.jsx'
import KorakOpis from '../components/prijava/KorakOpis.jsx'
import KorakLokacija from '../components/prijava/KorakLokacija.jsx'
import KorakPregled, { NAPOMENA_JAVNOST } from '../components/prijava/KorakPregled.jsx'
import StatusOznaka from '../components/StatusOznaka.jsx'
import Ikona from '../components/Ikona.jsx'
import { DEMO_KORISNIK_ID } from '../data/konstante.js'
import { dodajPrijavu, javnePrijave, sacuvajFotografiju, obrisiFotografiju } from '../data/storage.js'
import { provjeriOsnovno, provjeriLokaciju, imaGresaka } from '../logic/validacija.js'
import { pronadjiMoguceDuplikate } from '../logic/duplikati.js'
import { pripremiFotografiju } from '../utils/slike.js'

const PRAZAN_UNOS = { naslov: '', opis: '', kategorija: '' }
const NASLOVI_KORAKA = { 1: 'Opišite problem', 2: 'Označite lokaciju', 3: 'Provjerite i pošaljite' }

export default function PrijaviProblem() {
  const [korak, postaviKorak] = useState(1)
  const [unos, postaviUnos] = useState(PRAZAN_UNOS)
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
      postaviFotoGresku(e.message)
    } finally {
      postaviFotoObradu(false)
    }
  }

  function dalje() {
    const nove = korak === 1 ? provjeriOsnovno(unos) : provjeriLokaciju(lokacija)
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
      postaviGreskuSlanja(e.message)
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
      <section className="obrazac-stranica">
        <div className="kartica uspjeh">
          <span className="uspjeh-ikona" aria-hidden="true">
            <Ikona ime="kvacica" velicina={40} />
          </span>
          <h1 ref={naslovRef} tabIndex={-1}>
            Prijava je poslana
          </h1>
          <p>
            Status: <StatusOznaka status={poslana.prijava.status} />
          </p>
          <p>{NAPOMENA_JAVNOST}</p>
          {poslana.glavna && (
            <p>
              Prijava je povezana s prijavom „{poslana.glavna.naslov}“. Taj problem sada ima{' '}
              {poslana.glavna.brojPrijavitelja + 1} prijavitelja.
            </p>
          )}
          <div className="obrazac-dugmad">
            <Link to="/moje-prijave" className="dugme dugme-glavno">
              Moje prijave
            </Link>
            <button type="button" className="dugme dugme-sporedno" onClick={novaPrijava}>
              Nova prijava
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="obrazac-stranica">
      <h1>Prijavi problem</h1>
      <TrakaKoraka trenutni={korak} />

      <div className="kartica obrazac">
        <h2 ref={naslovRef} tabIndex={-1} className="naslov-koraka">
          Korak {korak}: {NASLOVI_KORAKA[korak]}
        </h2>

        {korak === 1 && (
          <KorakOpis
            unos={unos}
            promijeni={promijeni}
            greske={greske}
            fotografija={{
              foto,
              obrada: fotoObrada,
              greska: fotoGreska,
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
            greska={greskaSlanja}
          />
        )}

        {korak < 3 && (
          <div className="obrazac-dugmad">
            {korak > 1 && (
              <button type="button" className="dugme" onClick={() => postaviKorak(korak - 1)}>
                Nazad
              </button>
            )}
            <button type="button" className="dugme dugme-glavno" onClick={dalje} disabled={fotoObrada}>
              Dalje
              <Ikona ime="strelica" velicina={18} className="ikona-strelica" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
