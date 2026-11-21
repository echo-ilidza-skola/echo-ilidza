// Ručno povezivanje i razdvajanje prijava istog problema.
// Sistem samo PREDLAŽE moguće duplikate; povezuje tek administrator klikom.

import { useState } from 'react'
import { pronadjiMoguceDuplikate } from '../../logic/duplikati.js'
import { poveziPrijavu, razdvojiPrijavu } from '../../data/storage.js'

export default function Povezivanje({ prijava, sve, javiPoruku }) {
  const [odabrana, postaviOdabranu] = useState('')

  const glavna = prijava.glavnaPrijavaId ? sve.find((p) => p.id === prijava.glavnaPrijavaId) : null
  const povezane = sve.filter((p) => p.glavnaPrijavaId === prijava.id)

  function izvrsi(radnja, uspjeh) {
    try {
      radnja()
      javiPoruku(uspjeh)
    } catch (e) {
      javiPoruku(e.message, true)
    }
  }

  if (glavna) {
    return (
      <div className="admin-sekcija">
        <h3>Povezane prijave</h3>
        <p>
          Povezana s prijavom <strong>{glavna.naslov}</strong> ({glavna.id}), koja ima {glavna.brojPrijavitelja}{' '}
          prijavitelja.
        </p>
        <button
          type="button"
          className="dugme dugme-sporedno dugme-malo"
          onClick={() => izvrsi(() => razdvojiPrijavu(prijava.id), 'Prijave su razdvojene.')}
        >
          Razdvoji
        </button>
      </div>
    )
  }

  // Mogući duplikati među svim prijavama (administrator vidi i one na čekanju).
  const duplikati = pronadjiMoguceDuplikate(prijava, sve, { izuzmiId: prijava.id })
    .map((d) => ({ ...d, prijava: sve.find((p) => p.id === d.prijavaId) }))
    .filter((d) => d.prijava)
  const iste = sve.filter(
    (p) => p.id !== prijava.id && !p.glavnaPrijavaId && p.kategorija === prijava.kategorija && p.status !== 'ODBIJENO',
  )

  return (
    <div className="admin-sekcija">
      <h3>Povezane prijave</h3>
      {povezane.length > 0 ? (
        <>
          <p>Ovo je glavna prijava grupe ({prijava.brojPrijavitelja} prijavitelja). Povezane prijave:</p>
          <ul className="admin-lista-mala">
            {povezane.map((p) => (
              <li key={p.id}>
                {p.naslov} ({p.id})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="prigusen mali-tekst">Prijava nije povezana ni s jednom drugom.</p>
      )}

      {duplikati.length > 0 && (
        <div className="admin-duplikati">
          <p className="mali-tekst">
            <strong>Mogući duplikati</strong> (ista kategorija, manje od 50 m) – samo prijedlog:
          </p>
          <ul className="admin-lista-mala">
            {duplikati.map((d) => (
              <li key={d.prijavaId}>
                <span>
                  {d.prijava.naslov} ({d.prijavaId}), oko {Math.round(d.udaljenostM)} m
                </span>
                <button
                  type="button"
                  className="dugme dugme-sporedno dugme-malo"
                  onClick={() => izvrsi(() => poveziPrijavu(prijava.id, d.prijavaId), 'Prijave su povezane.')}
                >
                  Poveži
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {iste.length > 0 && (
        <div className="admin-red-polja">
          <label htmlFor={`povezi-${prijava.id}`} className="mali-tekst">
            Poveži ručno s prijavom iste kategorije:
          </label>
          <select id={`povezi-${prijava.id}`} value={odabrana} onChange={(e) => postaviOdabranu(e.target.value)}>
            <option value="">– odaberite prijavu –</option>
            {iste.map((p) => (
              <option key={p.id} value={p.id}>
                {p.naslov} ({p.id}, {p.naselje})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="dugme dugme-sporedno dugme-malo"
            disabled={!odabrana}
            onClick={() => izvrsi(() => poveziPrijavu(prijava.id, odabrana), 'Prijave su povezane.')}
          >
            Poveži
          </button>
        </div>
      )}
    </div>
  )
}
