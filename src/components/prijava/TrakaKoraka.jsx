// Prikaz napretka kroz obrazac: 1 Opis → 2 Lokacija → 3 Pregled.

import { useJezik } from '../../jezik/JezikContext.jsx'

const BROJ_KORAKA = 3

export default function TrakaKoraka({ trenutni }) {
  const { t } = useJezik()
  const koraci = [1, 2, 3].map((broj) => t(`obrazac.trakaKraci.${broj}`))
  return (
    <ol className="traka-koraka" aria-label={t('obrazac.trakaOznaka', { broj: trenutni, ukupno: BROJ_KORAKA })}>
      {koraci.map((naziv, i) => {
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
