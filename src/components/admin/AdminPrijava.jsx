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
import { dozvoljeniStatusi, napomenaZaPrikaz } from '../../logic/administracija.js'
import { formatirajDatum } from '../../logic/datum.js'
import {
  odobriPrijavu,
  odbijPrijavu,
  promijeniStatusPrijave,
  sacuvajKategorijuIPrioritet,
  sacuvajInternuNapomenu,
  postaviSakrivenuFotografiju,
} from '../../data/storage.js'
import { useJezik } from '../../jezik/JezikContext.jsx'
import { tekstGreske } from '../../jezik/greska.js'

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
  const { jezik, t } = useJezik()

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
      javiPoruku(tekstGreske(e, jezik), true)
      return false
    }
  }

  return (
    <article className="admin-prijava" aria-labelledby={`naslov-${id}`}>
      <header className="admin-prijava-glava">
        <div>
          <h2 id={`naslov-${id}`} className="admin-prijava-naslov">{prijava.naslov}</h2>
          <p className="admin-meta">
            <KategorijaOznaka kategorija={prijava.kategorija} />
            <span>{prijava.naselje}</span>
            <span>{formatirajDatum(prijava.datumPrijave, true, jezik)}</span>
            <span>{t('ap.autor', { autor: prijava.autorId })}</span>
            <span>{t('ap.id', { id })}</span>
          </p>
        </div>
        {/* Kad administrator promijeni status, lukovi eha se upale jedan za drugim (jednom). */}
        <StatusOznaka status={prijava.status} velicinaEha={26} animacija="pri-promjeni" />
      </header>

      <div className="admin-prijava-tijelo">
        <div className="admin-kolona">
          <p className="opis-tekst">{prijava.opis}</p>

          {prijava.fotografijaId ? (
            <div className="admin-sekcija">
              <Fotografija id={prijava.fotografijaId} alt={t('ap.fotoAlt', { naslov: prijava.naslov })} className="fotografija-mala" />
              {prijava.fotografijaSkrivena && <p className="info-okvir">{t('ap.fotoSakrivena')}</p>}
              <button
                type="button"
                className="dugme dugme-sporedno dugme-malo"
                onClick={() =>
                  izvrsi(
                    () => postaviSakrivenuFotografiju(id, !prijava.fotografijaSkrivena),
                    prijava.fotografijaSkrivena ? t('ap.fotoVidljiva') : t('ap.fotoSakrivenaPoruka'),
                  )
                }
              >
                {prijava.fotografijaSkrivena ? t('ap.prikaziFoto') : t('ap.sakrijFoto')}
              </button>
            </div>
          ) : (
            <p className="prigusen mali-tekst">{t('ap.nemaFoto')}</p>
          )}

          <OsnovnaMapa
            key={`${prijava.lat}-${prijava.lng}`}
            centar={{ lat: prijava.lat, lng: prijava.lng }}
            zoom={16}
            className="mapa mapa-admin"
            oznaka={t('ap.lokacija', { naslov: prijava.naslov })}
          >
            <Marker position={[prijava.lat, prijava.lng]} icon={napraviIkonu(prijava, jezik)} keyboard={false} />
          </OsnovnaMapa>
          {javna && (
            <p className="mali-tekst">
              <Link to={`/prijava/${id}`}>{t('ap.javniPrikaz')}</Link>
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
              <h3>{t('ap.odluka')}</h3>
              {!odbijanje ? (
                <div className="admin-dugmad">
                  <button
                    type="button"
                    className="dugme dugme-glavno"
                    onClick={() => {
                      const tekst = t('ap.odobrena', { naslov: prijava.naslov })
                      if (izvrsi(() => odobriPrijavu(id, { kategorija, prioritet }), tekst)) naOdluku?.(tekst)
                    }}
                  >
                    {t('ap.odobri')}
                  </button>
                  <button type="button" className="dugme dugme-upozorenje" onClick={() => postaviOdbijanje(true)}>
                    {t('ap.odbij')}
                  </button>
                </div>
              ) : (
                <div className="polje">
                  <label htmlFor={`razlog-${id}`}>{t('ap.razlog')}</label>
                  <textarea id={`razlog-${id}`} rows={3} value={razlog} onChange={(e) => postaviRazlog(e.target.value)} />
                  <div className="admin-dugmad">
                    <button
                      type="button"
                      className="dugme dugme-upozorenje"
                      onClick={() => {
                        const tekst = t('ap.odbijena', { naslov: prijava.naslov })
                        if (izvrsi(() => odbijPrijavu(id, razlog), tekst)) naOdluku?.(tekst)
                      }}
                    >
                      {t('ap.potvrdiOdbijanje')}
                    </button>
                    <button type="button" className="dugme dugme-sporedno" onClick={() => postaviOdbijanje(false)}>
                      {t('ap.odustani')}
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
                    izvrsi(() => sacuvajKategorijuIPrioritet(id, kategorija, prioritet), t('ap.sacuvanoKP'))
                  }
                >
                  {t('ap.sacuvajKP')}
                </button>
              </div>

              <div className="admin-sekcija">
                <h3>{t('ap.promjena')}</h3>
                <div className="polje">
                  <label htmlFor={`status-${id}`}>{t('ap.noviStatus')}</label>
                  <select id={`status-${id}`} value={noviStatus} onChange={(e) => postaviNoviStatus(e.target.value)}>
                    <option value="">{t('ap.odaberite')}</option>
                    {dozvoljeniStatusi(prijava.status).map((s) => (
                      <option key={s} value={s}>
                        {nazivStatusa(s, jezik)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="polje">
                  <label htmlFor={`napomena-${id}`}>
                    {t('ap.napomena')}
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
                      t('ap.promijenjen', { status: nazivStatusa(noviStatus, jezik) }),
                    )
                    if (ok) {
                      postaviNoviStatus('')
                      postaviJavnuNapomenu('')
                    }
                  }}
                >
                  {t('ap.promijeni')}
                </button>
              </div>
            </>
          )}

          <div className="admin-sekcija">
            <label htmlFor={`interna-${id}`} className="admin-naslov-polja">
              {t('ap.interna')}
            </label>
            <textarea id={`interna-${id}`} rows={2} value={interna} onChange={(e) => postaviInternu(e.target.value)} />
            <button
              type="button"
              className="dugme dugme-sporedno dugme-malo"
              onClick={() => izvrsi(() => sacuvajInternuNapomenu(id, interna), t('ap.internaSacuvana'))}
            >
              {t('ap.sacuvajNapomenu')}
            </button>
          </div>

          <Povezivanje prijava={prijava} sve={sve} javiPoruku={javiPoruku} />

          <details className="admin-historija">
            <summary>{t('ap.historija', { broj: prijava.historijaStatusa.length })}</summary>
            <ol className="historija">
              {prijava.historijaStatusa.map((k, i) => (
                <li key={i}>
                  <StatusOznaka status={k.status} />
                  <span className="historija-datum">{formatirajDatum(k.datum, true, jezik)}</span>
                  {k.napomena && <p className="historija-napomena">{napomenaZaPrikaz(k.napomena, jezik)}</p>}
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
