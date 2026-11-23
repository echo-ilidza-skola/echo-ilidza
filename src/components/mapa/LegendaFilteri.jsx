// Legenda i filteri u jednom: uz svaku kvačicu je mala oznaka u boji kategorije, odnosno sa značkom statusa.

import { KATEGORIJE, JAVNI_STATUSI, ZNACKE_STATUSA, nazivStatusa } from '../../data/konstante.js'
import { htmlPina } from './ikonaOznake.js'

// Mala oznaka (isti crtež kao na mapi). HTML je naš, bez teksta korisnika, pa je ubacivanje sigurno.
function MalaOznaka({ boja, status = null, brojPrijavitelja = 1 }) {
  return (
    <span
      className={brojPrijavitelja > 1 ? 'legenda-pin legenda-pin--talasi' : 'legenda-pin'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: htmlPina(boja, status, brojPrijavitelja) }}
    />
  )
}

// Dodaje vrijednost u listu ili je uklanja iz nje.
function prebaci(lista, vrijednost) {
  return lista.includes(vrijednost) ? lista.filter((v) => v !== vrijednost) : [...lista, vrijednost]
}

export default function LegendaFilteri({ otvoreno, filteri, promijeniFiltere, ponisti }) {
  return (
    <section
      id="legenda-filteri"
      className={otvoreno ? 'legenda legenda-otvorena' : 'legenda'}
      aria-labelledby="legenda-naslov"
    >
      <h2 id="legenda-naslov">Legenda i filteri</h2>
      <p className="prigusen mali-tekst">
        Sve oznake imaju isti oblik. Boja oznake je kategorija, a mala značka na oznaci je status.
      </p>

      <fieldset>
        <legend>Kategorija (boja oznake)</legend>
        {KATEGORIJE.map((k) => (
          <label key={k.kljuc} className="filter-opcija">
            <input
              type="checkbox"
              checked={filteri.kategorije.includes(k.kljuc)}
              onChange={() => promijeniFiltere({ ...filteri, kategorije: prebaci(filteri.kategorije, k.kljuc) })}
            />
            <MalaOznaka boja={k.boja} />
            {k.naziv}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Status (značka na oznaci)</legend>
        {JAVNI_STATUSI.map((s) => (
          <label key={s} className="filter-opcija">
            <input
              type="checkbox"
              checked={filteri.statusi.includes(s)}
              onChange={() => promijeniFiltere({ ...filteri, statusi: prebaci(filteri.statusi, s) })}
            />
            <MalaOznaka boja="var(--tekst-prigusen)" status={s} />
            {nazivStatusa(s)}
            <span className="vizuelno-skriveno">
              {' '}
              ({ZNACKE_STATUSA[s] ? `značka: ${ZNACKE_STATUSA[s].opis}` : 'bez značke'})
            </span>
          </label>
        ))}
      </fieldset>

      {/* Objašnjenje lukova eha oko oznake (nije filter). */}
      <p className="legenda-talasi">
        <MalaOznaka boja="var(--tekst-prigusen)" brojPrijavitelja={5} />
        <span>
          <strong>Talasi oko oznake:</strong> više građana prijavilo je isti problem. Što je talasa više, više je
          prijavitelja (2–3: jedan, 4–6: dva, 7 i više: tri). Tačan broj piše kad kliknete oznaku.
        </span>
      </p>

      <button type="button" className="dugme dugme-sporedno" onClick={ponisti}>
        Prikaži sve
      </button>
    </section>
  )
}
