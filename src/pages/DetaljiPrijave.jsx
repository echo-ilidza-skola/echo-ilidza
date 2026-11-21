// Detalji prijave: SAMO javna polja (bez autora, interne napomene i predloženog prioriteta).
// Prijava koja nije odobrena se ovdje ne prikazuje.

import { Link, useParams } from 'react-router-dom'
import { Marker } from 'react-leaflet'
import OsnovnaMapa from '../components/mapa/OsnovnaMapa.jsx'
import { napraviIkonu } from '../components/mapa/ikonaOznake.js'
import StatusOznaka from '../components/StatusOznaka.jsx'
import KategorijaOznaka from '../components/KategorijaOznaka.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { javnePrijave } from '../data/storage.js'
import { formatirajDatum } from '../logic/datum.js'
import { povezanePrijave } from '../logic/mapa.js'

export default function DetaljiPrijave() {
  const { id } = useParams()
  const javne = usePodaci(javnePrijave)
  const prijava = javne.find((p) => p.id === id)

  if (!prijava) {
    return (
      <section>
        <div className="kartica">
          <h1>Prijava nije dostupna</h1>
          <p>
            Prijava ne postoji ili još nije javna. Prijave postaju javne tek nakon provjere administratora.
          </p>
          <Link to="/mapa">Nazad na mapu</Link>
        </div>
      </section>
    )
  }

  const glavna = prijava.glavnaPrijavaId ? javne.find((p) => p.id === prijava.glavnaPrijavaId) : null
  const povezane = povezanePrijave(prijava.id, javne)

  return (
    <article className="detalji">
      <p>
        <Link to="/mapa">← Nazad na mapu</Link>
      </p>
      <h1>{prijava.naslov}</h1>

      <div className="detalji-oznake">
        <KategorijaOznaka kategorija={prijava.kategorija} />
        <StatusOznaka status={prijava.status} />
      </div>

      <dl className="detalji-polja">
        <dt>Prijavljeno</dt>
        <dd>{formatirajDatum(prijava.datumPrijave, true)}</dd>
        <dt>Naselje (približno)</dt>
        <dd>{prijava.naselje || 'nepoznato'}</dd>
        {/* Za povezanu prijavu prikazujemo broj prijavitelja cijele grupe (iz glavne prijave). */}
        <dt>{glavna ? 'Broj prijavitelja (cijela grupa)' : 'Broj prijavitelja'}</dt>
        <dd>{glavna ? glavna.brojPrijavitelja : prijava.brojPrijavitelja}</dd>
      </dl>

      <section className="kartica">
        <h2>Opis</h2>
        <p className="opis-tekst">{prijava.opis}</p>
        {/* Fotografije se dodaju u etapi 4. Testne prijave nemaju fotografija. */}
        {!prijava.fotografijaId && <p className="prigusen mali-tekst">Prijava nema fotografiju.</p>}
      </section>

      {(glavna || povezane.length > 0) && (
        <section className="kartica">
          <h2>Povezane prijave</h2>
          {glavna && (
            <p>
              Ova prijava je povezana s prijavom <Link to={`/prijava/${glavna.id}`}>{glavna.naslov}</Link>, jer
              opisuje isti problem.
            </p>
          )}
          {povezane.length > 0 && (
            <>
              <p>Isti problem su prijavili i drugi građani:</p>
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
        <h2>Lokacija</h2>
        {/* key: nova mapa za svaku prijavu, da se centrira i kad pređemo na povezanu prijavu. */}
        <OsnovnaMapa
          key={prijava.id}
          centar={{ lat: prijava.lat, lng: prijava.lng }}
          zoom={16}
          className="mapa mapa-mala"
          oznaka="Lokacija prijave na mapi"
        >
          <Marker position={[prijava.lat, prijava.lng]} icon={napraviIkonu(prijava)} keyboard={false} />
        </OsnovnaMapa>
        <p className="prigusen mali-tekst">Lokacija je onakva kakvu je odabrao građanin.</p>
      </section>

      <section className="kartica">
        <h2>Historija statusa</h2>
        <ol className="historija">
          {prijava.historijaStatusa.map((korak, i) => (
            <li key={i}>
              <StatusOznaka status={korak.status} />
              <span className="historija-datum">{formatirajDatum(korak.datum, true)}</span>
              {korak.napomena && <p className="historija-napomena">{korak.napomena}</p>}
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
