// Stilizovani prikaz javnih prijava kao svijetlećih tačaka na zelenoj "mrlji".
// Oblik je UKRASNI – nije prava mapa ni granica općine. Položaj tačke se računa iz koordinata
// prijave (sjever je gore), a svaka tačka je spojena tankom linijom s najbližom susjednom tačkom.

import { Link } from 'react-router-dom'
import Ikona from '../Ikona.jsx'
import { OKVIR_ILIDZE } from '../../data/konstante.js'
import { projektujTacku, okvirTacaka } from '../../logic/mapa.js'
import { posljednjePrijave } from '../../logic/statistika.js'

const SIRINA = 300
const VISINA = 200
// Tačke se crtaju u unutrašnjem dijelu slike, da ne izađu iz zelenog oblika.
const UNUTRA = { x: 40, y: 32, sirina: 220, visina: 120 }

// Ukrasni organski oblik (nije granica općine).
const OBLIK =
  'M28 92 C20 62 46 38 78 36 C96 20 126 14 150 26 C170 14 204 18 222 38 C252 40 278 62 274 92 ' +
  'C286 118 266 146 236 150 C222 172 188 180 164 168 C140 184 104 182 88 164 C56 166 30 144 34 120 C20 112 22 100 28 92 Z'

// Za svaku tačku pronađe najbližu drugu tačku (za tanke linije između njih).
function linijeDoNajblizih(tacke) {
  const linije = []
  tacke.forEach((a, i) => {
    let najbliza = null
    let d = Infinity
    tacke.forEach((b, j) => {
      if (i === j) return
      const r = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
      if (r < d) {
        d = r
        najbliza = b
      }
    })
    if (najbliza) linije.push([a, najbliza])
  })
  return linije
}

export default function MiniMapaGlasova({ javne: sveJavne }) {
  // Najnovije prvo, da tri najnovije prijave dobiju krug eha.
  const javne = posljednjePrijave(sveJavne, sveJavne.length)
  // Okvir prilagođen prijavama, da tačke budu raširene po cijelom obliku.
  const okvir = okvirTacaka(javne, OKVIR_ILIDZE)
  const tacke = javne.map((p) => {
    const t = projektujTacku(p, okvir, UNUTRA.sirina, UNUTRA.visina)
    return { id: p.id, x: UNUTRA.x + t.x, y: UNUTRA.y + t.y }
  })

  return (
    <section className="pocetna-kartica mini-mapa" aria-labelledby="mini-mapa-naslov">
      <h2 id="mini-mapa-naslov">Ilidža kroz glas građana</h2>
      <div className="mini-mapa-okvir">
        <svg
          className="mini-mapa-slika"
          viewBox={`0 0 ${SIRINA} ${VISINA}`}
          role="img"
          aria-label={`Stilizovani prikaz: ${javne.length} javnih prijava kao svjetleće tačke`}
        >
          <path className="mini-mapa-oblik" d={OBLIK} />
          {linijeDoNajblizih(tacke).map(([a, b], i) => (
            <line key={`l${i}`} className="mini-mapa-linija" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          ))}
          {tacke.map((t, i) => (
            <g key={t.id}>
              {i < 3 && (
                <circle className="mini-mapa-eho" cx={t.x} cy={t.y} r="12" style={{ animationDelay: `${i * 0.9}s` }} />
              )}
              <circle className="mini-mapa-sjaj" cx={t.x} cy={t.y} r="8" style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
              <circle className="mini-mapa-tacka" cx={t.x} cy={t.y} r="3.2" />
            </g>
          ))}
        </svg>
        <p className="mini-mapa-poruka" aria-hidden="true">
          Zajedno
          <br />
          za bolji grad!
        </p>
      </div>
      <p className="mini-mapa-tekst">
        Svjetleće tačke prikazuju lokacije javnih prijava. <span className="vizuelno-skriveno">Zajedno za bolji grad!</span>
      </p>
      <Link to="/mapa" className="dugme dugme-glavno">
        Pogledaj mapu
        <Ikona ime="strelica" velicina={18} />
      </Link>
    </section>
  )
}
