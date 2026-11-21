// Ukras u hero dijelu: oznake koje šalju "signal" (krugovi eha), lukovi koji ih povezuju
// i svjetleće tačke koje putuju po lukovima (signal ide od oznake do glavne oznake i nazad – eho).
// Samo dekoracija – čitač ekrana je preskače (aria-hidden).
// Ako korisnik u sistemu traži manje pokreta, tačke koje putuju se ne prikazuju,
// a CSS gasi ostale animacije.

import { useManjePokreta } from '../hooks/useManjePokreta.js'

const OZNAKE = [
  { x: 330, y: 215, glavna: true },
  { x: 110, y: 250 },
  { x: 205, y: 135 },
  { x: 470, y: 120 },
  { x: 540, y: 265 },
  { x: 410, y: 330 },
]

// Oblik oznake (pin) čiji je vrh u tački (0, 0).
const PIN = 'M0 0c-6-9-12-14.5-12-22a12 12 0 0 1 24 0c0 7.5-6 13-12 22z'

// Luk od oznake "o" do glavne oznake (kvadratna Bezierova kriva).
function putanjaLuka(o, glavna) {
  const vrhY = Math.min(glavna.y, o.y) - 70
  return `M${o.x} ${o.y} Q${(glavna.x + o.x) / 2} ${vrhY} ${glavna.x} ${glavna.y}`
}

export default function HeroSignali() {
  const manjePokreta = useManjePokreta()
  const glavna = OZNAKE[0]
  const ostale = OZNAKE.slice(1)

  return (
    <svg className="hero-signali" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sjaj-signala">
          <stop offset="0%" stopColor="#f4ffd9" />
          <stop offset="45%" stopColor="#b4f04a" />
          <stop offset="100%" stopColor="#b4f04a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Lukovi od svake oznake prema glavnoj; isprekidana linija "teče" */}
      {ostale.map((o, i) => (
        <path
          key={`luk-${o.x}`}
          id={`luk-${i}`}
          className="hero-luk"
          style={{ animationDelay: `${0.6 + i * 0.15}s, ${i * 0.4}s` }}
          d={putanjaLuka(o, glavna)}
        />
      ))}

      {/* Signali koji putuju po lukovima: od oznake do glavne i nazad (eho) */}
      {!manjePokreta &&
        ostale.map((o, i) => (
          <circle key={`signal-${o.x}`} className="hero-signal" r="7" fill="url(#sjaj-signala)">
            <animateMotion
              dur={`${3.2 + i * 0.45}s`}
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

      {/* Krugovi eha oko glavne oznake */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={`eho-${i}`}
          className="hero-eho"
          style={{ animationDelay: `${1 + i * 1.1}s` }}
          cx={glavna.x}
          cy={glavna.y}
          rx="60"
          ry="20"
        />
      ))}

      {/* Oznake: padnu na svoje mjesto jedna za drugom, pa lagano lebde */}
      {OZNAKE.map((o, i) => (
        <g key={`pin-${o.x}`} transform={`translate(${o.x} ${o.y}) scale(${o.glavna ? 1.9 : 1})`}>
          <ellipse className="hero-sjena-pina" cx="0" cy="0" rx="9" ry="3" />
          <g className="hero-pin-ulaz" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
            <g className="hero-pin-lebdi" style={{ animationDelay: `${i * 0.5}s` }}>
              <path className={o.glavna ? 'hero-pin hero-pin-glavni' : 'hero-pin'} d={PIN} />
              <circle className="hero-pin-srediste" cx="0" cy="-22" r="4.5" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}
