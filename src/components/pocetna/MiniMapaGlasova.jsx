// Stilizovani prikaz javnih prijava kao svijetlećih tačaka (nije prava mapa ni granica općine).
// Položaj tačke se računa iz koordinata prijave (sjever je gore).

import { Link } from 'react-router-dom'
import Ikona from '../Ikona.jsx'
import { OKVIR_ILIDZE } from '../../data/konstante.js'
import { projektujTacku, okvirTacaka } from '../../logic/mapa.js'

const SIRINA = 300
const VISINA = 190

export default function MiniMapaGlasova({ javne }) {
  // Okvir prilagođen prijavama, da tačke budu raširene po cijeloj slici.
  const okvir = okvirTacaka(javne, OKVIR_ILIDZE)
  return (
    <section className="pocetna-kartica mini-mapa" aria-labelledby="mini-mapa-naslov">
      <h2 id="mini-mapa-naslov">Ilidža na mapi prijava</h2>
      <svg className="mini-mapa-slika" viewBox={`0 0 ${SIRINA} ${VISINA}`} role="img" aria-label={`${javne.length} javnih prijava prikazano kao tačke`}>
        {/* Blaga mreža u pozadini */}
        {[1, 2, 3, 4, 5].map((i) => (
          <line key={`v${i}`} className="mini-mapa-mreza" x1={i * 50} y1="0" x2={i * 50} y2={VISINA} />
        ))}
        {[1, 2, 3].map((i) => (
          <line key={`h${i}`} className="mini-mapa-mreza" x1="0" y1={i * 47.5} x2={SIRINA} y2={i * 47.5} />
        ))}
        {javne.map((p) => {
          const t = projektujTacku(p, okvir, SIRINA, VISINA)
          return (
            <g key={p.id}>
              <circle className="mini-mapa-sjaj" cx={t.x} cy={t.y} r="9" />
              <circle className="mini-mapa-tacka" cx={t.x} cy={t.y} r="3.5" />
            </g>
          )
        })}
      </svg>
      <p className="mini-mapa-tekst">Svaka tačka je jedna javna prijava.</p>
      <Link to="/mapa" className="dugme dugme-glavno">
        Pogledaj mapu
        <Ikona ime="strelica" velicina={18} />
      </Link>
    </section>
  )
}
