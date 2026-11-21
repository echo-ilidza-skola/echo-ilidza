// Javna mapa prijava: samo odobrene prijave (Zaprimljeno, U obradi, Proslijeđeno, Riješeno).

import { useState } from 'react'
import { Link } from 'react-router-dom'
import OsnovnaMapa from '../components/mapa/OsnovnaMapa.jsx'
import OznakaPrijave from '../components/mapa/OznakaPrijave.jsx'
import LegendaFilteri from '../components/mapa/LegendaFilteri.jsx'
import StatusOznaka from '../components/StatusOznaka.jsx'
import KategorijaOznaka from '../components/KategorijaOznaka.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { javnePrijave } from '../data/storage.js'
import { KATEGORIJE, JAVNI_STATUSI, CENTAR_MAPE } from '../data/konstante.js'
import { grupisiZaMapu, filtrirajPrijave } from '../logic/mapa.js'

function sviFilteri() {
  return { kategorije: KATEGORIJE.map((k) => k.kljuc), statusi: [...JAVNI_STATUSI] }
}

export default function Mapa() {
  const javne = usePodaci(javnePrijave)
  const [filteri, postaviFiltere] = useState(sviFilteri)

  const naMapi = grupisiZaMapu(javne)
  const prikazane = filtrirajPrijave(naMapi, filteri)

  return (
    <section>
      <h1>Mapa prijava</h1>
      <p className="uvod">
        Na mapi su samo prijave koje je administrator odobrio. Nove prijave postaju vidljive tek nakon provjere.
      </p>

      <div className="mapa-raspored">
        <div className="mapa-glavni">
          <OsnovnaMapa centar={CENTAR_MAPE} zoom={13} className="mapa" oznaka="Mapa javnih prijava">
            {prikazane.map((p) => (
              <OznakaPrijave key={p.id} prijava={p} />
            ))}
          </OsnovnaMapa>
          <p className="prigusen mali-tekst" aria-live="polite">
            Prikazano je {prikazane.length} od {naMapi.length} oznaka. Povezane prijave istog problema su
            jedna oznaka.
          </p>
        </div>

        <LegendaFilteri filteri={filteri} promijeniFiltere={postaviFiltere} ponisti={() => postaviFiltere(sviFilteri())} />
      </div>

      {/* Lista je zamjena za mapu za one koji ne mogu koristiti mapu (npr. čitač ekrana). */}
      <section className="kartica">
        <h2>Prijave prikazane na mapi</h2>
        {prikazane.length === 0 ? (
          <p>Nijedna prijava ne odgovara odabranim filterima.</p>
        ) : (
          <ul className="lista-prijava">
            {prikazane.map((p) => (
              <li key={p.id}>
                <Link to={`/prijava/${p.id}`}>{p.naslov}</Link>
                <span className="lista-detalji">
                  <KategorijaOznaka kategorija={p.kategorija} />
                  <StatusOznaka status={p.status} />
                  {p.brojPrijavitelja > 1 && <span>Prijavitelja: {p.brojPrijavitelja}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
