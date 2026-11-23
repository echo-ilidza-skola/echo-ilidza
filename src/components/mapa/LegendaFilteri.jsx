// Legenda i filteri u jednom: uz svaku kvačicu je mala oznaka u boji kategorije, odnosno sa značkom statusa.

import { KATEGORIJE, JAVNI_STATUSI, ZNACKE_STATUSA, nazivStatusa } from '../../data/konstante.js'
import { htmlPina } from './ikonaOznake.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

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
  const { jezik, t } = useJezik()
  return (
    <section
      id="legenda-filteri"
      className={otvoreno ? 'legenda legenda-otvorena' : 'legenda'}
      aria-labelledby="legenda-naslov"
    >
      <h2 id="legenda-naslov">{t('mapa.legendaFilteri')}</h2>
      <p className="prigusen mali-tekst">{t('legenda.opis')}</p>

      <fieldset>
        <legend>{t('legenda.kategorija')}</legend>
        {KATEGORIJE.map((k) => (
          <label key={k.kljuc} className="filter-opcija">
            <input
              type="checkbox"
              checked={filteri.kategorije.includes(k.kljuc)}
              onChange={() => promijeniFiltere({ ...filteri, kategorije: prebaci(filteri.kategorije, k.kljuc) })}
            />
            <MalaOznaka boja={k.boja} />
            {t(`kategorije.${k.kljuc}`)}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>{t('legenda.status')}</legend>
        {JAVNI_STATUSI.map((s) => (
          <label key={s} className="filter-opcija">
            <input
              type="checkbox"
              checked={filteri.statusi.includes(s)}
              onChange={() => promijeniFiltere({ ...filteri, statusi: prebaci(filteri.statusi, s) })}
            />
            <MalaOznaka boja="var(--tekst-prigusen)" status={s} />
            {nazivStatusa(s, jezik)}
            <span className="vizuelno-skriveno">
              {' '}
              ({ZNACKE_STATUSA[s] ? t('legenda.znacka', { opis: t(`znacke.${ZNACKE_STATUSA[s].opis}`) }) : t('legenda.bezZnacke')})
            </span>
          </label>
        ))}
      </fieldset>

      {/* Objašnjenje lukova eha oko oznake (nije filter). */}
      <p className="legenda-talasi">
        <MalaOznaka boja="var(--tekst-prigusen)" brojPrijavitelja={5} />
        <span>
          <strong>{t('legenda.talasiNaslov')}</strong>
          {t('legenda.talasiTekst')}
        </span>
      </p>

      <button type="button" className="dugme dugme-sporedno" onClick={ponisti}>
        {t('legenda.prikaziSve')}
      </button>
    </section>
  )
}
