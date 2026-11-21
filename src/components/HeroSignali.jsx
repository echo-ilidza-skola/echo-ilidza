// Ukras u hero dijelu: oznake koje šalju "signal" (krugovi eha) i lukovi koji ih povezuju.
// Samo dekoracija – čitač ekrana je preskače (aria-hidden).
// Animacija se gasi ako korisnik u sistemu traži manje pokreta (prefers-reduced-motion).

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

export default function HeroSignali() {
  const glavna = OZNAKE[0]
  return (
    <svg className="hero-signali" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      {/* Lukovi od glavne oznake prema ostalima */}
      {OZNAKE.slice(1).map((o) => (
        <path
          key={`luk-${o.x}`}
          className="hero-luk"
          d={`M${glavna.x} ${glavna.y} Q${(glavna.x + o.x) / 2} ${Math.min(glavna.y, o.y) - 70} ${o.x} ${o.y}`}
        />
      ))}

      {/* Krugovi eha oko glavne oznake */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={`eho-${i}`}
          className="hero-eho"
          style={{ animationDelay: `${i * 1.1}s` }}
          cx={glavna.x}
          cy={glavna.y}
          rx="60"
          ry="20"
        />
      ))}

      {OZNAKE.map((o) => (
        <g key={`pin-${o.x}`} transform={`translate(${o.x} ${o.y}) scale(${o.glavna ? 1.9 : 1})`}>
          <ellipse className="hero-sjena-pina" cx="0" cy="0" rx="9" ry="3" />
          <path className={o.glavna ? 'hero-pin hero-pin-glavni' : 'hero-pin'} d={PIN} />
          <circle className="hero-pin-srediste" cx="0" cy="-22" r="4.5" />
        </g>
      ))}
    </svg>
  )
}
