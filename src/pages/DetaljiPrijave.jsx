// Detalji prijave: SAMO javna polja (bez autora, interne napomene i predloženog prioriteta).
// Prijava koja nije odobrena se ovdje ne prikazuje.

import { Link, useParams } from 'react-router-dom'
import { Marker } from 'react-leaflet'
import OsnovnaMapa from '../components/mapa/OsnovnaMapa.jsx'
import { napraviIkonu } from '../components/mapa/ikonaOznake.js'
import KategorijaOznaka from '../components/KategorijaOznaka.jsx'
import Fotografija from '../components/Fotografija.jsx'
import EhoStatus from '../components/EhoStatus.jsx'
import TrakaStranice from '../components/TrakaStranice.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { nazivStatusa } from '../data/konstante.js'
import { javnePrijave } from '../data/storage.js'
import { formatirajDatum } from '../logic/datum.js'
import { povezanePrijave } from '../logic/mapa.js'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function DetaljiPrijave() {
  const { id } = useParams()
  const javne = usePodaci(javnePrijave)
  const prijava = javne.find((p) => p.id === id)
  const { jezik, t } = useJezik()

  if (!prijava) {
    return (
      <>
        <TrakaStranice naslov={t('detalji.nedostupnaNaslov')} />
        <section>
          <div className="kartica">
            <p>{t('detalji.nedostupnaTekst')}</p>
            <Link to="/mapa">{t('detalji.nazadNaMapu')}</Link>
          </div>
        </section>
      </>
    )
  }

  const glavna = prijava.glavnaPrijavaId ? javne.find((p) => p.id === prijava.glavnaPrijavaId) : null
  const povezane = povezanePrijave(prijava.id, javne)
  const zadnjaPromjena = prijava.historijaStatusa[prijava.historijaStatusa.length - 1]

  return (
    <>
      <TrakaStranice
        naslov={prijava.naslov}
        nazad={
          <Link to="/mapa" className="traka-stranice-nazad">
            ← {t('detalji.nazadNaMapu')}
          </Link>
        }
      />
      <article className="detalji">

        <div className="detalji-oznake">
          <KategorijaOznaka kategorija={prijava.kategorija} />
        </div>

        {/* Status kao eho: jedna velika oznaka u boji statusa (lukovi se upale jedan za drugim) i datum posljednje promjene. */}
        <section className={`kartica eho-kartica eho-kartica--${prijava.status.toLowerCase()}`} aria-labelledby="status-naslov">
          <div className="eho-kartica-glava">
            <EhoStatus status={prijava.status} velicina={72} animacija="pri-prikazu" />
            <div>
              <h2 id="status-naslov" className="eho-kartica-oznaka">{t('detalji.statusPrijave')}</h2>
              {/* Naziv čitač ekrana već čuje iz znaka eha (aria-label), pa ga ovdje preskače. */}
              <p className="eho-kartica-naziv" aria-hidden="true">{nazivStatusa(prijava.status, jezik)}</p>
              <p className="eho-kartica-datum">
                {t('detalji.posljednjaPromjena', { datum: formatirajDatum(zadnjaPromjena.datum, false, jezik) })}
              </p>
            </div>
          </div>
        </section>

        <dl className="detalji-polja">
          <dt>{t('detalji.prijavljeno')}</dt>
          <dd>{formatirajDatum(prijava.datumPrijave, true, jezik)}</dd>
          <dt>{t('detalji.naselje')}</dt>
          <dd>{prijava.naselje || t('detalji.nepoznato')}</dd>
          {/* Za povezanu prijavu prikazujemo broj prijavitelja cijele grupe (iz glavne prijave). */}
          <dt>{glavna ? t('detalji.brojGrupa') : t('detalji.broj')}</dt>
          <dd>{glavna ? glavna.brojPrijavitelja : prijava.brojPrijavitelja}</dd>
        </dl>

        <section className="kartica">
          <h2>{t('detalji.opis')}</h2>
          <p className="opis-tekst">{prijava.opis}</p>
          {/* Javni prikaz daje fotografijaId = null ako je administrator sakrio fotografiju. */}
          {prijava.fotografijaId ? (
            <Fotografija id={prijava.fotografijaId} alt={t('detalji.fotoAlt', { naslov: prijava.naslov })} />
          ) : (
            <p className="prigusen mali-tekst">{t('detalji.nemaFoto')}</p>
          )}
        </section>

        {(glavna || povezane.length > 0) && (
          <section className="kartica">
            <h2>{t('detalji.povezane')}</h2>
            {glavna && (
              <p>
                {t('detalji.povezanaS')} <Link to={`/prijava/${glavna.id}`}>{glavna.naslov}</Link>
                {t('detalji.isti')}
              </p>
            )}
            {povezane.length > 0 && (
              <>
                <p>{t('detalji.drugiGradjani')}</p>
                <ul>
                  {povezane.map((p) => (
                    <li key={p.id}>
                      <Link to={`/prijava/${p.id}`}>{p.naslov}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        <section className="kartica">
          <h2>{t('detalji.lokacija')}</h2>
          {/* key: nova mapa za svaku prijavu, da se centrira i kad pređemo na povezanu prijavu. */}
          <OsnovnaMapa
            key={prijava.id}
            centar={{ lat: prijava.lat, lng: prijava.lng }}
            zoom={16}
            className="mapa mapa-mala"
            oznaka={t('detalji.lokacijaMapa')}
          >
            <Marker position={[prijava.lat, prijava.lng]} icon={napraviIkonu(prijava, jezik)} keyboard={false} />
          </OsnovnaMapa>
          <p className="prigusen mali-tekst">{t('detalji.lokacijaNapomena')}</p>
        </section>

      </article>
    </>
  )
}
