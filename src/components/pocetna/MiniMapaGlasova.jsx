// Stilizovani prikaz javnih prijava kao svijetlećih tačaka (nije prava mapa ni granica općine).
// Položaj tačke se računa iz koordinata prijave (sjever je gore).

import { Link } from 'react-router-dom'
import Ikona from '../Ikona.jsx'
import { OKVIR_ILIDZE } from '../../data/konstante.js'
import { projektujTacku, okvirTacaka } from '../../logic/mapa.js'
import { posljednjePrijave } from '../../logic/statistika.js'

const SIRINA = 300
const VISINA = 190

export default function MiniMapaGlasova({ javne: sveJavne }) {
  // Najnovije prvo, da tri najnovije prijave dobiju krug eha.
  const javne = posljednjePrijave(sveJavne, sveJavne.length)
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
        {/* Linija koja polako "skenira" mapu (samo ukras) */}
        <rect className="mini-mapa-sken" x="0" y="0" width="60" height={VISINA} />

        {javne.map((p, i) => {
          const t = projektujTacku(p, okvir, SIRINA, VISINA)
          // Svaka tačka treperi u svom ritmu; najnovije tri šalju i krug eha.
          const kasnjenje = `${(i * 0.37) % 3}s`
          return (
            <g key={p.id}>
              {i < 3 && <circle className="mini-mapa-eho" cx={t.x} cy={t.y} r="14" style={{ animationDelay: `${i * 0.9}s` }} />}
              <circle className="mini-mapa-sjaj" cx={t.x} cy={t.y} r="9" style={{ animationDelay: kasnjenje }} />
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
