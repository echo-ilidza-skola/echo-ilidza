// Moje prijave: sve prijave trenutnog DEMO korisnika, uključujući one na čekanju i odbijene (s razlogom).
// Autor vidi i svoju fotografiju dok prijava čeka provjeru.

import { Link } from 'react-router-dom'
import KategorijaOznaka from '../components/KategorijaOznaka.jsx'
import StatusOznaka from '../components/StatusOznaka.jsx'
import Fotografija from '../components/Fotografija.jsx'
import EhoVremenskaLinija from '../components/EhoVremenskaLinija.jsx'
import Ikona from '../components/Ikona.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { prijaveAutora, javnePrijave } from '../data/storage.js'
import { DEMO_KORISNIK_ID, STATUSI } from '../data/konstante.js'
import { formatirajDatum } from '../logic/datum.js'
import { napomenaZaPrikaz } from '../logic/administracija.js'
import { posljednjePrijave } from '../logic/statistika.js'
import TrakaStranice from '../components/TrakaStranice.jsx'
import { useJezik } from '../jezik/JezikContext.jsx'

function MojaPrijava({ prijava, javne }) {
  const javna = STATUSI[prijava.status].javno
  const glavna = prijava.glavnaPrijavaId ? javne.find((p) => p.id === prijava.glavnaPrijavaId) : null
  const zadnjiKorak = prijava.historijaStatusa[prijava.historijaStatusa.length - 1]
  const { jezik, t } = useJezik()

  return (
    <li className="moja-prijava">
      <div className="moja-prijava-glava">
        <h2 className="moja-prijava-naslov">
          {javna ? <Link to={`/prijava/${prijava.id}`}>{prijava.naslov}</Link> : prijava.naslov}
        </h2>
        <StatusOznaka status={prijava.status} />
      </div>

      <p className="moja-prijava-detalji">
        <KategorijaOznaka kategorija={prijava.kategorija} />
        <span>
          <Ikona ime="mapa" velicina={14} /> {prijava.naselje}
        </span>
        <span>{t('moje.poslano', { datum: formatirajDatum(prijava.datumPrijave, false, jezik) })}</span>
      </p>

      <EhoVremenskaLinija prijava={prijava} />

      {prijava.status === 'NA_CEKANJU' && (
        <p className="info-okvir">{t('moje.nijeJavna')}</p>
      )}
      {prijava.status === 'ODBIJENO' && (
        <div className="razlog-odbijanja">
          <strong>{t('moje.razlog')}</strong> {prijava.razlogOdbijanja}
          <p className="mali-tekst">{t('moje.odbijenaNapomena')}</p>
        </div>
      )}
      {glavna && (
        <p className="mali-tekst">
          {t('moje.povezanaS')} <Link to={`/prijava/${glavna.id}`}>{glavna.naslov}</Link>
          {t('moje.istiProblem')}
        </p>
      )}

      {prijava.fotografijaId && (
        <Fotografija id={prijava.fotografijaId} alt={t('moje.fotoAlt', { naslov: prijava.naslov })} className="fotografija-mala" />
      )}

      <details className="moja-historija">
        <summary>
          {t('moje.historija', { datum: formatirajDatum(zadnjiKorak.datum, false, jezik) })}
        </summary>
        <ol className="historija">
          {prijava.historijaStatusa.map((korak, i) => (
            <li key={i}>
              <StatusOznaka status={korak.status} />
              <span className="historija-datum">{formatirajDatum(korak.datum, true, jezik)}</span>
              {korak.napomena && <p className="historija-napomena">{napomenaZaPrikaz(korak.napomena, jezik)}</p>}
            </li>
          ))}
        </ol>
      </details>
    </li>
  )
}

export default function MojePrijave() {
  const moje = usePodaci(() => posljednjePrijave(prijaveAutora(DEMO_KORISNIK_ID), Infinity))
  const javne = usePodaci(javnePrijave)
  const { t } = useJezik()

  return (
    <>
      <TrakaStranice naslov={t('nav.moje')}>
        <Link to="/prijavi" className="dugme dugme-glavno">
          <Ikona ime="prijavi" velicina={18} />
          {t('moje.novaPrijava')}
        </Link>
      </TrakaStranice>
      <section>
        <p className="uvod">
          {t('moje.uvod')}
        </p>

        {moje.length === 0 ? (
          <div className="kartica">
            <p>{t('moje.nema')}</p>
          </div>
        ) : (
          <ul className="moje-lista">
            {moje.map((p) => (
              <MojaPrijava key={p.id} prijava={p} javne={javne} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
