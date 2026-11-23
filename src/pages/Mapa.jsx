// Javna mapa prijava: samo odobrene prijave (Zaprimljeno, U obradi, Proslijeđeno, Riješeno).

import { useState } from 'react'
import { Link } from 'react-router-dom'
import OsnovnaMapa from '../components/mapa/OsnovnaMapa.jsx'
import OznakaPrijave from '../components/mapa/OznakaPrijave.jsx'
import LegendaFilteri from '../components/mapa/LegendaFilteri.jsx'
import ToplotniSloj from '../components/mapa/ToplotniSloj.jsx'
import MojaLokacija from '../components/mapa/MojaLokacija.jsx'
import StatusOznaka from '../components/StatusOznaka.jsx'
import KategorijaOznaka from '../components/KategorijaOznaka.jsx'
import Ikona from '../components/Ikona.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { javnePrijave } from '../data/storage.js'
import { KATEGORIJE, JAVNI_STATUSI, CENTAR_MAPE } from '../data/konstante.js'
import { grupisiZaMapu, filtrirajPrijave } from '../logic/mapa.js'
import TrakaStranice from '../components/TrakaStranice.jsx'

function sviFilteri() {
  return { kategorije: KATEGORIJE.map((k) => k.kljuc), statusi: [...JAVNI_STATUSI] }
}

export default function Mapa() {
  const javne = usePodaci(javnePrijave)
  const [filteri, postaviFiltere] = useState(sviFilteri)
  // Na mobitelu su legenda i filteri skriveni iza dugmeta; na računaru su uvijek vidljivi.
  const [filteriOtvoreni, postaviFiltereOtvorene] = useState(false)
  // Toplotna mapa je isključena dok je korisnik ne uključi.
  const [toplotna, postaviToplotnu] = useState(false)
  // Poruka o "mojoj lokaciji" (traženje, uspjeh ili zašto GPS ne radi).
  const [porukaLokacije, postaviPorukuLokacije] = useState(null)

  const naMapi = grupisiZaMapu(javne)
  const prikazane = filtrirajPrijave(naMapi, filteri)

  return (
    <>
      <TrakaStranice naslov="Mapa prijava" />
      <section>
        <p className="uvod">
          Na mapi su samo prijave koje je administrator odobrio. Nove prijave postaju vidljive tek nakon provjere.
        </p>

        <div className="mapa-alati">
          <p className="mapa-brojac" aria-live="polite">
            Prikazano <strong>{prikazane.length}</strong> od {naMapi.length} oznaka
          </p>
          {/* Prekidač (switch): čitač ekrana pročita "Toplotna mapa, uključeno/isključeno". */}
          <button
            type="button"
            role="switch"
            aria-checked={toplotna}
            className={toplotna ? 'prekidac-toplotna prekidac-toplotna--ukljuceno' : 'prekidac-toplotna'}
            onClick={() => postaviToplotnu(!toplotna)}
          >
            <span className="prekidac-staza" aria-hidden="true">
              <span className="prekidac-kruzic" />
            </span>
            Toplotna mapa
          </button>
          <button
            type="button"
            className="dugme dugme-sporedno dugme-filteri"
            aria-expanded={filteriOtvoreni}
            aria-controls="legenda-filteri"
            onClick={() => postaviFiltereOtvorene(!filteriOtvoreni)}
          >
            <Ikona ime={filteriOtvoreni ? 'zatvori' : 'filter'} velicina={18} />
            {filteriOtvoreni ? 'Sakrij filtere' : 'Legenda i filteri'}
          </button>
        </div>

        <div className="mapa-raspored">
          <div className="mapa-glavni">
            <OsnovnaMapa centar={CENTAR_MAPE} zoom={13} className="mapa" oznaka="Mapa javnih prijava">
              {toplotna && <ToplotniSloj prijave={prikazane} />}
              <MojaLokacija naPoruku={postaviPorukuLokacije} />
              {prikazane.map((p) => (
                <OznakaPrijave key={p.id} prijava={p} />
              ))}
            </OsnovnaMapa>
            {/* Čitač ekrana pročita poruku čim se promijeni. */}
            <p className="mapa-poruka-lokacije" aria-live="polite">
              {porukaLokacije}
            </p>
            <p className="prigusen mali-tekst">
              Povezane prijave istog problema prikazane su kao jedna oznaka.
              {toplotna &&
                ' Toplotna mapa: što je boja toplija (od zelene prema narandžastoj), to je na tom mjestu više prijava i prijavitelja. Prati odabrane filtere.'}
            </p>
          </div>

          <LegendaFilteri
            otvoreno={filteriOtvoreni}
            filteri={filteri}
            promijeniFiltere={postaviFiltere}
            ponisti={() => postaviFiltere(sviFilteri())}
          />
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
    </>
  )
}
