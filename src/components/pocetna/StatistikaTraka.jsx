// Tri broja u hero dijelu: javne prijave, u obradi, riješeno.
// Brojevi su STVARNI – računaju se iz javnih (testnih) prijava u ovom pregledniku.
// Pri prikazu se "odbrojavaju" od nule (osim uz "manje pokreta").

import Ikona from '../Ikona.jsx'
import { osnovnaStatistika } from '../../logic/statistika.js'
import { useBrojanje } from '../../hooks/useBrojanje.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

function Stavka({ broj, naziv, ikona, klasa }) {
  const prikazano = useBrojanje(broj)
  return (
    <li className="stat">
      <span className={`stat-ikona ${klasa}`} aria-hidden="true">
        <Ikona ime={ikona} velicina={22} />
      </span>
      <span className="stat-tekst">
        {/* Čitač ekrana odmah dobija konačan broj, a vizuelno se broj odbrojava. */}
        <span className="stat-broj" aria-hidden="true">
          {prikazano}
        </span>
        <span className="vizuelno-skriveno">{broj}</span>
        <span className="stat-naziv">{naziv}</span>
      </span>
    </li>
  )
}

export default function StatistikaTraka({ javne }) {
  const s = osnovnaStatistika(javne)
  const { t } = useJezik()
  return (
    <ul className="statistika-traka ulaz ulaz-5" aria-label={t('statistika.oznaka')}>
      <Stavka broj={s.ukupno} naziv={t('statistika.javne')} ikona="moje" klasa="stat-ikona--zelena" />
      <Stavka broj={s.uObradi} naziv={t('statistika.uObradi')} ikona="sat" klasa="stat-ikona--zuta" />
      <Stavka broj={s.rijeseno} naziv={t('statistika.rijeseno')} ikona="kvaka" klasa="stat-ikona--kvacica" />
    </ul>
  )
}
