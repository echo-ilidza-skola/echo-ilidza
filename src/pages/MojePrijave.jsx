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
import { posljednjePrijave } from '../logic/statistika.js'
import TrakaStranice from '../components/TrakaStranice.jsx'

function MojaPrijava({ prijava, javne }) {
  const javna = STATUSI[prijava.status].javno
  const glavna = prijava.glavnaPrijavaId ? javne.find((p) => p.id === prijava.glavnaPrijavaId) : null
  const zadnjiKorak = prijava.historijaStatusa[prijava.historijaStatusa.length - 1]

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
        <span>Poslano {formatirajDatum(prijava.datumPrijave)}</span>
      </p>

      <EhoVremenskaLinija prijava={prijava} />

      {prijava.status === 'NA_CEKANJU' && (
        <p className="info-okvir">Prijava još nije javna. Postat će javna kada je administrator provjeri i odobri.</p>
      )}
      {prijava.status === 'ODBIJENO' && (
        <div className="razlog-odbijanja">
          <strong>Razlog odbijanja:</strong> {prijava.razlogOdbijanja}
          <p className="mali-tekst">Odbijena prijava nije javna. Možete poslati novu prijavu s više detalja.</p>
        </div>
      )}
      {glavna && (
        <p className="mali-tekst">
          Povezana s prijavom <Link to={`/prijava/${glavna.id}`}>{glavna.naslov}</Link> (isti problem).
        </p>
      )}

      {prijava.fotografijaId && (
        <Fotografija id={prijava.fotografijaId} alt={`Fotografija uz prijavu: ${prijava.naslov}`} className="fotografija-mala" />
      )}

      <details className="moja-historija">
        <summary>
          Historija statusa (posljednja promjena {formatirajDatum(zadnjiKorak.datum)})
        </summary>
        <ol className="historija">
          {prijava.historijaStatusa.map((korak, i) => (
            <li key={i}>
              <StatusOznaka status={korak.status} />
              <span className="historija-datum">{formatirajDatum(korak.datum, true)}</span>
              {korak.napomena && <p className="historija-napomena">{korak.napomena}</p>}
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

  return (
    <>
      <TrakaStranice naslov="Moje prijave">
        <Link to="/prijavi" className="dugme dugme-glavno">
          <Ikona ime="prijavi" velicina={18} />
          Nova prijava
        </Link>
      </TrakaStranice>
      <section>
        <p className="uvod">
          Prijave demo građanina u ovom pregledniku, i one koje još čekaju provjeru. Status vam „odgovara“ kao eho.
        </p>

        {moje.length === 0 ? (
          <div className="kartica">
            <p>Još nemate prijava.</p>
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
