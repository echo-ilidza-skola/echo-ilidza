// Lista svih prijava s filterima. Klik na "Otvori" prikazuje sve alate za tu prijavu.

import { useState } from 'react'
import AdminPrijava from './AdminPrijava.jsx'
import StatusOznaka from '../StatusOznaka.jsx'
import KategorijaOznaka from '../KategorijaOznaka.jsx'
import { KATEGORIJE, NASELJA, STATUSI, PRIORITETI } from '../../data/konstante.js'
import { filtrirajZaAdmina } from '../../logic/administracija.js'
import { posljednjePrijave } from '../../logic/statistika.js'
import { formatirajDatum } from '../../logic/datum.js'

const PRAZNI_FILTERI = { status: '', kategorija: '', naselje: '', tekst: '' }

export default function SvePrijave({ sve }) {
  const [filteri, postaviFiltere] = useState(PRAZNI_FILTERI)
  const [otvorena, postaviOtvorenu] = useState(null)

  const prikazane = posljednjePrijave(filtrirajZaAdmina(sve, filteri), Infinity)
  const promijeni = (polje) => (e) => postaviFiltere({ ...filteri, [polje]: e.target.value })

  return (
    <div>
      <div className="admin-filteri" role="search" aria-label="Filteri prijava">
        <div className="polje">
          <label htmlFor="f-tekst">Pretraga</label>
          <input id="f-tekst" type="text" value={filteri.tekst} onChange={promijeni('tekst')} placeholder="naslov, opis ili id" />
        </div>
        <div className="polje">
          <label htmlFor="f-status">Status</label>
          <select id="f-status" value={filteri.status} onChange={promijeni('status')}>
            <option value="">Svi statusi</option>
            {Object.entries(STATUSI).map(([k, s]) => (
              <option key={k} value={k}>
                {s.naziv}
              </option>
            ))}
          </select>
        </div>
        <div className="polje">
          <label htmlFor="f-kategorija">Kategorija</label>
          <select id="f-kategorija" value={filteri.kategorija} onChange={promijeni('kategorija')}>
            <option value="">Sve kategorije</option>
            {KATEGORIJE.map((k) => (
              <option key={k.kljuc} value={k.kljuc}>
                {k.naziv}
              </option>
            ))}
          </select>
        </div>
        <div className="polje">
          <label htmlFor="f-naselje">Naselje</label>
          <select id="f-naselje" value={filteri.naselje} onChange={promijeni('naselje')}>
            <option value="">Sva naselja</option>
            {NASELJA.map((n) => (
              <option key={n.naziv} value={n.naziv}>
                {n.naziv}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="dugme dugme-sporedno dugme-malo" onClick={() => postaviFiltere(PRAZNI_FILTERI)}>
          Poništi filtere
        </button>
      </div>

      <p className="prigusen" aria-live="polite">
        Prikazano {prikazane.length} od {sve.length} prijava (najnovije prve).
      </p>

      <ul className="admin-lista">
        {prikazane.map((p) => {
          const otvoreno = otvorena === p.id
          return (
            <li key={p.id} className={otvoreno ? 'admin-red admin-red--otvoren' : 'admin-red'}>
              <div className="admin-red-glava">
                <div className="admin-red-tekst">
                  <strong>{p.naslov}</strong>
                  <span className="admin-meta">
                    <KategorijaOznaka kategorija={p.kategorija} />
                    <span>{p.naselje}</span>
                    <span>{formatirajDatum(p.datumPrijave)}</span>
                    {p.brojPrijavitelja > 1 && <span>Prijavitelja: {p.brojPrijavitelja}</span>}
                    {p.glavnaPrijavaId && <span>Povezana s {p.glavnaPrijavaId}</span>}
                    <span>
                      Prioritet: {p.potvrdjeniPrioritet ? PRIORITETI[p.potvrdjeniPrioritet] : 'nije potvrđen'}
                    </span>
                  </span>
                </div>
                <StatusOznaka status={p.status} />
                <button
                  type="button"
                  className="dugme dugme-sporedno dugme-malo"
                  aria-expanded={otvoreno}
                  aria-controls={`admin-detalji-${p.id}`}
                  onClick={() => postaviOtvorenu(otvoreno ? null : p.id)}
                >
                  {otvoreno ? 'Zatvori' : 'Otvori'}
                </button>
              </div>
              {otvoreno && (
                <div id={`admin-detalji-${p.id}`}>
                  <AdminPrijava prijava={p} sve={sve} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
