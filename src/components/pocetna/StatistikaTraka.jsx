// Tri broja u hero dijelu: javne prijave, u obradi, riješeno.
// Brojevi su STVARNI – računaju se iz javnih (testnih) prijava u ovom pregledniku.

import Ikona from '../Ikona.jsx'
import { osnovnaStatistika } from '../../logic/statistika.js'

export default function StatistikaTraka({ javne }) {
  const s = osnovnaStatistika(javne)
  const stavke = [
    { broj: s.ukupno, naziv: 'Javne prijave', ikona: 'moje', klasa: 'stat-ikona--zelena' },
    { broj: s.uObradi, naziv: 'U obradi', ikona: 'sat', klasa: 'stat-ikona--zuta' },
    { broj: s.rijeseno, naziv: 'Riješeno', ikona: 'kvacica', klasa: 'stat-ikona--zelena' },
  ]

  return (
    <ul className="statistika-traka" aria-label="Statistika javnih prijava (testni podaci)">
      {stavke.map((st) => (
        <li key={st.naziv} className="stat">
          <span className={`stat-ikona ${st.klasa}`} aria-hidden="true">
            <Ikona ime={st.ikona} velicina={22} />
          </span>
          <span className="stat-tekst">
            <span className="stat-broj">{st.broj}</span>
            <span className="stat-naziv">{st.naziv}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
