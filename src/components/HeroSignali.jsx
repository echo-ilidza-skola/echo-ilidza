// Ukras u hero dijelu: oznake na slici Ilidže, lukovi koji ih povezuju s glavnom oznakom
// i svjetleći signali koji putuju po lukovima (glas → odjek).
//
// VAŽNO: SVG koristi ISTE koordinate kao slika (1672 × 941 px) i isto "rezanje" kao slika
// (preserveAspectRatio="xMidYMax slice" = object-fit: cover). Zato glavna oznaka uvijek stoji
// tačno na fontani, bez obzira na veličinu ekrana.
// Samo dekoracija – čitač ekrana je preskače (aria-hidden).

import { useManjePokreta } from '../hooks/useManjePokreta.js'
import { useSirokEkran } from '../hooks/useSirokEkran.js'

// Sredina fontane na slici hero-ilidza-ai.jpg (u pikselima slike).
const FONTANA = { x: 1003, y: 716 }

// Ostale oznake (vrh oznake je tačka na slici).
// Mobitel i tablet: slika se vidi cijela, pa su oznake raspoređene po cijeloj slici.
const OZNAKE_MOBITEL = [
  { x: 330, y: 330 }, // udaljenija tačka, lijevo
  { x: 760, y: 330 }, // središnji dio
  { x: 1462, y: 532 }, // desno
  { x: 1238, y: 592 }, // kod parka
]

// Računar: gornji dio slike je odsječen i preko njega je zaglavlje, a lijevo je tekst.
// Zato su sve oznake niže i desno od teksta, da ih zaglavlje ne "reže".
const OZNAKE_RACUNAR = [
  { x: 1130, y: 500 }, // iza fontane
  { x: 1600, y: 640 }, // desno, uz rijeku
  { x: 1462, y: 532 }, // desno
  { x: 1238, y: 592 }, // kod parka
]

// Oblik oznake (pin) čiji je vrh u tački (0, 0).
const PIN = 'M0 0c-6-9-12-14.5-12-22a12 12 0 0 1 24 0c0 7.5-6 13-12 22z'

// Luk od oznake do fontane: kriva koja se izdiže iznad obje tačke (za "visina" piksela slike).
function putanjaLuka(o, visina) {
  const vrhY = Math.min(FONTANA.y, o.y) - visina
  return `M${o.x} ${o.y} Q${(FONTANA.x + o.x) / 2} ${vrhY} ${FONTANA.x} ${FONTANA.y}`
}

function Oznaka({ x, y, mjerilo, glavna, kasnjenje }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${mjerilo})`}>
      {/* Mali krug eha ispod svake oznake */}
      <ellipse className="hero-mali-eho" style={{ animationDelay: `${kasnjenje * 3}s` }} cx="0" cy="0" rx="16" ry="5.5" />
      <ellipse className="hero-sjena-pina" cx="0" cy="0" rx="9" ry="3" />
      <g className="hero-pin-ulaz" style={{ animationDelay: `${kasnjenje}s` }}>
        <g className="hero-pin-lebdi" style={{ animationDelay: `${kasnjenje * 2}s` }}>
          <path className={glavna ? 'hero-pin hero-pin-glavni' : 'hero-pin'} d={PIN} />
          <circle className="hero-pin-srediste" cx="0" cy="-22" r="4.5" />
        </g>
      </g>
    </g>
  )
}

export default function HeroSignali() {
  const manjePokreta = useManjePokreta()
  const sirokEkran = useSirokEkran()
  const OZNAKE = sirokEkran ? OZNAKE_RACUNAR : OZNAKE_MOBITEL
  // Na računaru su lukovi niži, da ne ulaze pod zaglavlje.
  const visinaLuka = sirokEkran ? 80 : 150

  return (
    <svg
      className="hero-signali"
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="sjaj-fontane">
          <stop offset="0%" stopColor="#d9ff8a" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#b4f04a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b4f04a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sjaj-signala">
          <stop offset="0%" stopColor="#f4ffd9" />
          <stop offset="45%" stopColor="#b4f04a" />
          <stop offset="100%" stopColor="#b4f04a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sjaj na tlu oko fontane */}
      <ellipse className="hero-sjaj-tla" cx={FONTANA.x} cy={FONTANA.y} rx="205" ry="86" fill="url(#sjaj-fontane)" />

      {/* Stalne elipse na tlu (kao krugovi na vodi) i elipse koje se šire (eho) */}
      {[65, 115, 165].map((rx) => (
        <ellipse key={`krug-${rx}`} className="hero-krug" cx={FONTANA.x} cy={FONTANA.y} rx={rx} ry={rx * 0.34} />
      ))}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={`eho-${i}`}
          className="hero-eho"
          style={{ animationDelay: `${1 + i * 1.1}s` }}
          cx={FONTANA.x}
          cy={FONTANA.y}
          rx="95"
          ry="32"
        />
      ))}

      {/* Lukovi: puna svijetleća linija + svjetlo koje "teče" po njoj */}
      {OZNAKE.map((o, i) => (
        <g key={`luk-${o.x}`}>
          <path id={`luk-${i}`} className="hero-luk" style={{ animationDelay: `${0.6 + i * 0.15}s` }} d={putanjaLuka(o, visinaLuka)} />
          <path className="hero-luk-tok" style={{ animationDelay: `${i * 0.5}s` }} d={putanjaLuka(o, visinaLuka)} />
        </g>
      ))}

      {/* Signali koji putuju od oznake do fontane i nazad (eho) */}
      {!manjePokreta &&
        OZNAKE.map((o, i) => (
          <circle key={`signal-${o.x}`} className="hero-signal" r="12" fill="url(#sjaj-signala)">
            <animateMotion
              dur={`${3.4 + i * 0.45}s`}
              begin={`${1.2 + i * 0.7}s`}
              repeatCount="indefinite"
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
            >
              <mpath href={`#luk-${i}`} />
            </animateMotion>
          </circle>
        ))}

      {OZNAKE.map((o, i) => (
        <Oznaka key={`pin-${o.x}`} x={o.x} y={o.y} mjerilo={1.7} kasnjenje={0.35 + i * 0.12} />
      ))}
      {/* Glavna oznaka stoji na fontani */}
      <Oznaka x={FONTANA.x} y={FONTANA.y} mjerilo={3.1} glavna kasnjenje={0.2} />
    </svg>
  )
}
