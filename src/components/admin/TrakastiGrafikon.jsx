// Jednostavan trakasti grafikon u čistom CSS-u (bez biblioteke).
// Svaka traka ima i broj ispisan tekstom, da se podatak ne čita samo iz dužine trake.

export default function TrakastiGrafikon({ naslov, stavke }) {
  const najveci = Math.max(1, ...stavke.map((s) => s.broj))
  const ukupno = stavke.reduce((zbir, s) => zbir + s.broj, 0)

  return (
    <figure className="grafikon">
      <figcaption className="grafikon-naslov">
        {naslov} <span className="prigusen">(ukupno {ukupno})</span>
      </figcaption>
      <ul className="grafikon-lista">
        {stavke.map((s) => (
          <li key={s.naziv} className="grafikon-red">
            <span className="grafikon-naziv">{s.naziv}</span>
            <span className="grafikon-traka-okvir" aria-hidden="true">
              <span
                className="grafikon-traka"
                style={{ width: `${(s.broj / najveci) * 100}%`, background: s.boja || 'var(--primarna)' }}
              />
            </span>
            <span className="grafikon-broj">{s.broj}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
