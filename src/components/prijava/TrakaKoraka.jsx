// Prikaz napretka kroz obrazac: 1 Opis → 2 Lokacija → 3 Pregled.

const KORACI = ['Opis', 'Lokacija', 'Pregled']

export default function TrakaKoraka({ trenutni }) {
  return (
    <ol className="traka-koraka" aria-label={`Korak ${trenutni} od ${KORACI.length}`}>
      {KORACI.map((naziv, i) => {
        const broj = i + 1
        const stanje = broj < trenutni ? 'gotov' : broj === trenutni ? 'trenutni' : 'sljedeci'
        return (
          <li key={naziv} className={`traka-korak traka-korak--${stanje}`} aria-current={stanje === 'trenutni' ? 'step' : undefined}>
            <span className="traka-korak-broj" aria-hidden="true">
              {stanje === 'gotov' ? '✓' : broj}
            </span>
            <span className="traka-korak-naziv">{naziv}</span>
          </li>
        )
      })}
    </ol>
  )
}
