// Ručno povezivanje i razdvajanje prijava istog problema.
// Sistem samo PREDLAŽE moguće duplikate; povezuje tek administrator klikom.

import { useState } from 'react'
import { pronadjiMoguceDuplikate } from '../../logic/duplikati.js'
import { poveziPrijavu, razdvojiPrijavu } from '../../data/storage.js'
import { useJezik } from '../../jezik/JezikContext.jsx'
import { tekstGreske } from '../../jezik/greska.js'
import { PRAG_DUPLIKATA_M } from '../../data/konstante.js'

export default function Povezivanje({ prijava, sve, javiPoruku }) {
  const [odabrana, postaviOdabranu] = useState('')
  const { jezik, t } = useJezik()

  const glavna = prijava.glavnaPrijavaId ? sve.find((p) => p.id === prijava.glavnaPrijavaId) : null
  const povezane = sve.filter((p) => p.glavnaPrijavaId === prijava.id)

  function izvrsi(radnja, uspjeh) {
    try {
      radnja()
      javiPoruku(uspjeh)
    } catch (e) {
      javiPoruku(tekstGreske(e, jezik), true)
    }
  }

  if (glavna) {
    return (
      <div className="admin-sekcija">
        <h3>{t('pov.naslov')}</h3>
        <p>{t('pov.povezanaS', { naslov: glavna.naslov, id: glavna.id, broj: glavna.brojPrijavitelja })}</p>
        <button
          type="button"
          className="dugme dugme-sporedno dugme-malo"
          onClick={() => izvrsi(() => razdvojiPrijavu(prijava.id), t('pov.razdvojene'))}
        >
          {t('pov.razdvoji')}
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
      <h3>{t('pov.naslov')}</h3>
      {povezane.length > 0 ? (
        <>
          <p>{t('pov.glavna', { broj: prijava.brojPrijavitelja })}</p>
          <ul className="admin-lista-mala">
            {povezane.map((p) => (
              <li key={p.id}>
                {p.naslov} ({p.id})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="prigusen mali-tekst">{t('pov.nijePovezana')}</p>
      )}

      {duplikati.length > 0 && (
        <div className="admin-duplikati">
          <p className="mali-tekst">
            <strong>{t('pov.duplikati')}</strong>
            {t('pov.duplikatiUslov', { m: PRAG_DUPLIKATA_M })}
          </p>
          <ul className="admin-lista-mala">
            {duplikati.map((d) => (
              <li key={d.prijavaId}>
                <span>
                  {t('pov.oko', { naslov: d.prijava.naslov, id: d.prijavaId, m: Math.round(d.udaljenostM) })}
                </span>
                <button
                  type="button"
                  className="dugme dugme-sporedno dugme-malo"
                  onClick={() => izvrsi(() => poveziPrijavu(prijava.id, d.prijavaId), t('pov.povezane'))}
                >
                  {t('pov.povezi')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {iste.length > 0 && (
        <div className="admin-red-polja">
          <label htmlFor={`povezi-${prijava.id}`} className="mali-tekst">
            {t('pov.rucno')}
          </label>
          <select id={`povezi-${prijava.id}`} value={odabrana} onChange={(e) => postaviOdabranu(e.target.value)}>
            <option value="">{t('pov.odaberitePrijavu')}</option>
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
            onClick={() => izvrsi(() => poveziPrijavu(prijava.id, odabrana), t('pov.povezane'))}
          >
            {t('pov.povezi')}
          </button>
        </div>
      )}
    </div>
  )
}
