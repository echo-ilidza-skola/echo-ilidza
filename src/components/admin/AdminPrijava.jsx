// Sve što administrator radi s jednom prijavom: pregled (opis, fotografija, lokacija),
// prijedlog pravila i potvrda, status (odobri/odbij ili promjena), interna napomena, povezivanje.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Marker } from 'react-leaflet'
import OsnovnaMapa from '../mapa/OsnovnaMapa.jsx'
import { napraviIkonu } from '../mapa/ikonaOznake.js'
import StatusOznaka from '../StatusOznaka.jsx'
import KategorijaOznaka from '../KategorijaOznaka.jsx'
import Fotografija from '../Fotografija.jsx'
import PrijedlogPravila from './PrijedlogPravila.jsx'
import Povezivanje from './Povezivanje.jsx'
import { STATUSI, nazivStatusa } from '../../data/konstante.js'
import { dozvoljeniStatusi } from '../../logic/administracija.js'
import { formatirajDatum } from '../../logic/datum.js'
import {
  odobriPrijavu,
  odbijPrijavu,
  promijeniStatusPrijave,
  sacuvajKategorijuIPrioritet,
  sacuvajInternuNapomenu,
  postaviSakrivenuFotografiju,
} from '../../data/storage.js'

// naOdluku: neobavezno; poziva se nakon odobravanja/odbijanja (kartica tada nestaje iz reda čekanja,
// pa poruku prikazuje roditelj).
export default function AdminPrijava({ prijava, sve, naOdluku }) {
  const [kategorija, postaviKategoriju] = useState(prijava.kategorija)
  const [prioritet, postaviPrioritet] = useState(prijava.potvrdjeniPrioritet || prijava.predlozeniPrioritet || 'nizak')
  const [odbijanje, postaviOdbijanje] = useState(false)
  const [razlog, postaviRazlog] = useState('')
  const [noviStatus, postaviNoviStatus] = useState('')
  const [javnaNapomena, postaviJavnuNapomenu] = useState('')
  const [interna, postaviInternu] = useState(prijava.internaNapomena || '')
  const [poruka, postaviPoruku] = useState(null) // { tekst, greska }

  const id = prijava.id
  const naCekanju = prijava.status === 'NA_CEKANJU'
  const javna = STATUSI[prijava.status].javno

  function javiPoruku(tekst, greska = false) {
    postaviPoruku({ tekst, greska })
  }

  // Pokreće izmjenu i javlja uspjeh ili grešku (npr. nedostaje razlog odbijanja).
  function izvrsi(radnja, uspjeh) {
    try {
      radnja()
      javiPoruku(uspjeh)
      return true
    } catch (e) {
      javiPoruku(e.message, true)
      return false
    }
  }

  return (
    <article className="admin-prijava" aria-labelledby={`naslov-${id}`}>
      <header className="admin-prijava-glava">
        <div>
          <h3 id={`naslov-${id}`}>{prijava.naslov}</h3>
          <p className="admin-meta">
            <KategorijaOznaka kategorija={prijava.kategorija} />
            <span>{prijava.naselje}</span>
            <span>{formatirajDatum(prijava.datumPrijave, true)}</span>
            <span>Autor (demo): {prijava.autorId}</span>
            <span>Id: {id}</span>
          </p>
        </div>
        <StatusOznaka status={prijava.status} />
      </header>

      <div className="admin-prijava-tijelo">
        <div className="admin-kolona">
          <p className="opis-tekst">{prijava.opis}</p>

          {prijava.fotografijaId ? (
            <div className="admin-sekcija">
              <Fotografija id={prijava.fotografijaId} alt={`Fotografija uz prijavu: ${prijava.naslov}`} className="fotografija-mala" />
              {prijava.fotografijaSkrivena && <p className="info-okvir">Fotografija je sakrivena iz javnog prikaza.</p>}
              <button
                type="button"
                className="dugme dugme-sporedno dugme-malo"
                onClick={() =>
                  izvrsi(
                    () => postaviSakrivenuFotografiju(id, !prijava.fotografijaSkrivena),
                    prijava.fotografijaSkrivena ? 'Fotografija je ponovo vidljiva u javnom prikazu.' : 'Fotografija je sakrivena.',
                  )
                }
              >
                {prijava.fotografijaSkrivena ? 'Prikaži fotografiju javno' : 'Sakrij fotografiju'}
              </button>
            </div>
          ) : (
            <p className="prigusen mali-tekst">Prijava nema fotografiju.</p>
          )}

          <OsnovnaMapa
            key={`${prijava.lat}-${prijava.lng}`}
            centar={{ lat: prijava.lat, lng: prijava.lng }}
            zoom={16}
            className="mapa mapa-admin"
            oznaka={`Lokacija prijave ${prijava.naslov}`}
          >
            <Marker position={[prijava.lat, prijava.lng]} icon={napraviIkonu(prijava)} keyboard={false} />
          </OsnovnaMapa>
          {javna && (
            <p className="mali-tekst">
              <Link to={`/prijava/${id}`}>Otvori javni prikaz ove prijave</Link>
            </p>
          )}
        </div>

        <div className="admin-kolona">
          <PrijedlogPravila
            prijava={prijava}
            kategorija={kategorija}
            prioritet={prioritet}
            promijeniKategoriju={postaviKategoriju}
            promijeniPrioritet={postaviPrioritet}
          />

          {naCekanju ? (
            <div className="admin-sekcija">
              <h4>Odluka</h4>
              {!odbijanje ? (
                <div className="admin-dugmad">
                  <button
                    type="button"
                    className="dugme dugme-glavno"
                    onClick={() => {
                      const tekst = `„${prijava.naslov}“ je odobrena i sada je javna (Zaprimljeno).`
                      if (izvrsi(() => odobriPrijavu(id, { kategorija, prioritet }), tekst)) naOdluku?.(tekst)
                    }}
                  >
                    Odobri
                  </button>
                  <button type="button" className="dugme dugme-upozorenje" onClick={() => postaviOdbijanje(true)}>
                    Odbij
                  </button>
                </div>
              ) : (
                <div className="polje">
                  <label htmlFor={`razlog-${id}`}>Razlog odbijanja (vidi ga autor prijave) *</label>
                  <textarea id={`razlog-${id}`} rows={3} value={razlog} onChange={(e) => postaviRazlog(e.target.value)} />
                  <div className="admin-dugmad">
                    <button
                      type="button"
                      className="dugme dugme-upozorenje"
                      onClick={() => {
                        const tekst = `„${prijava.naslov}“ je odbijena. Autor vidi razlog.`
                        if (izvrsi(() => odbijPrijavu(id, razlog), tekst)) naOdluku?.(tekst)
                      }}
                    >
                      Potvrdi odbijanje
                    </button>
                    <button type="button" className="dugme dugme-sporedno" onClick={() => postaviOdbijanje(false)}>
                      Odustani
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="admin-sekcija">
                <button
                  type="button"
                  className="dugme dugme-sporedno dugme-malo"
                  onClick={() =>
                    izvrsi(() => sacuvajKategorijuIPrioritet(id, kategorija, prioritet), 'Kategorija i prioritet su sačuvani.')
                  }
                >
                  Sačuvaj kategoriju i prioritet
                </button>
              </div>

              <div className="admin-sekcija">
                <h4>Promjena statusa</h4>
                <div className="polje">
                  <label htmlFor={`status-${id}`}>Novi status</label>
                  <select id={`status-${id}`} value={noviStatus} onChange={(e) => postaviNoviStatus(e.target.value)}>
                    <option value="">– odaberite –</option>
                    {dozvoljeniStatusi(prijava.status).map((s) => (
                      <option key={s} value={s}>
                        {nazivStatusa(s)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="polje">
                  <label htmlFor={`napomena-${id}`}>
                    Napomena uz promjenu (javna – vidi se u historiji statusa)
                  </label>
                  <input
                    id={`napomena-${id}`}
                    type="text"
                    value={javnaNapomena}
                    onChange={(e) => postaviJavnuNapomenu(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="dugme dugme-glavno dugme-malo"
                  disabled={!noviStatus}
                  onClick={() => {
                    const ok = izvrsi(
                      () => promijeniStatusPrijave(id, noviStatus, javnaNapomena),
                      `Status je promijenjen u „${nazivStatusa(noviStatus)}“.`,
                    )
                    if (ok) {
                      postaviNoviStatus('')
                      postaviJavnuNapomenu('')
                    }
                  }}
                >
                  Promijeni status
                </button>
              </div>
            </>
          )}

          <div className="admin-sekcija">
            <label htmlFor={`interna-${id}`} className="admin-naslov-polja">
              Interna napomena (samo administracija, nikad javno)
            </label>
            <textarea id={`interna-${id}`} rows={2} value={interna} onChange={(e) => postaviInternu(e.target.value)} />
            <button
              type="button"
              className="dugme dugme-sporedno dugme-malo"
              onClick={() => izvrsi(() => sacuvajInternuNapomenu(id, interna), 'Interna napomena je sačuvana.')}
            >
              Sačuvaj napomenu
            </button>
          </div>

          <Povezivanje prijava={prijava} sve={sve} javiPoruku={javiPoruku} />

          <details className="admin-historija">
            <summary>Historija statusa ({prijava.historijaStatusa.length})</summary>
            <ol className="historija">
              {prijava.historijaStatusa.map((k, i) => (
                <li key={i}>
                  <StatusOznaka status={k.status} />
                  <span className="historija-datum">{formatirajDatum(k.datum, true)}</span>
                  {k.napomena && <p className="historija-napomena">{k.napomena}</p>}
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>

      <p className={poruka?.greska ? 'admin-poruka admin-poruka--greska' : 'admin-poruka'} role="status" aria-live="polite">
        {poruka?.tekst}
      </p>
    </article>
  )
}
