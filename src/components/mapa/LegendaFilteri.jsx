// Legenda i filteri u jednom: svaka kvačica pokazuje i boju kategorije, odnosno oblik statusa.

import { KATEGORIJE, JAVNI_STATUSI, OBLICI_STATUSA, nazivStatusa } from '../../data/konstante.js'
import { klasaOblika } from './ikonaOznake.js'

// Dodaje vrijednost u listu ili je uklanja iz nje.
function prebaci(lista, vrijednost) {
  return lista.includes(vrijednost) ? lista.filter((v) => v !== vrijednost) : [...lista, vrijednost]
}

export default function LegendaFilteri({ filteri, promijeniFiltere, ponisti }) {
  return (
    <section className="legenda" aria-labelledby="legenda-naslov">
      <h2 id="legenda-naslov">Legenda i filteri</h2>
      <p className="prigusen mali-tekst">
        Boja oznake je kategorija, a oblik je status. Broj u uglu oznake je broj prijavitelja istog problema.
      </p>

      <fieldset>
        <legend>Kategorija (boja)</legend>
        {KATEGORIJE.map((k) => (
          <label key={k.kljuc} className="filter-opcija">
            <input
              type="checkbox"
              checked={filteri.kategorije.includes(k.kljuc)}
              onChange={() => promijeniFiltere({ ...filteri, kategorije: prebaci(filteri.kategorije, k.kljuc) })}
            />
            <span className="oznaka oznaka--krug oznaka--mala" style={{ background: k.boja }} aria-hidden="true" />
            {k.naziv}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Status (oblik)</legend>
        {JAVNI_STATUSI.map((s) => (
          <label key={s} className="filter-opcija">
            <input
              type="checkbox"
              checked={filteri.statusi.includes(s)}
              onChange={() => promijeniFiltere({ ...filteri, statusi: prebaci(filteri.statusi, s) })}
            />
            <span className={`${klasaOblika(s)} oznaka--mala oznaka--siva`} aria-hidden="true" />
            {nazivStatusa(s)}
            <span className="vizuelno-skriveno"> (oblik: {OBLICI_STATUSA[s].opis})</span>
          </label>
        ))}
      </fieldset>

      <button type="button" className="dugme dugme-sporedno" onClick={ponisti}>
        Prikaži sve
      </button>
    </section>
  )
}
