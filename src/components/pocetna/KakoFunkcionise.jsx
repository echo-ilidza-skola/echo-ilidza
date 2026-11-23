// Tri koraka: opiši, označi, prati.

import Ikona from '../Ikona.jsx'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Tekstovi koraka su u rječniku (src/jezik): kako.korak1Naslov, kako.korak1Tekst …
const KORACI = [
  { ikona: 'poruka', naslov: 'kako.korak1Naslov', tekst: 'kako.korak1Tekst' },
  { ikona: 'mapa', naslov: 'kako.korak2Naslov', tekst: 'kako.korak2Tekst' },
  { ikona: 'kvacica', naslov: 'kako.korak3Naslov', tekst: 'kako.korak3Tekst' },
]

export default function KakoFunkcionise() {
  const { t } = useJezik()
  return (
    <section className="pocetna-kartica kako" aria-labelledby="kako-naslov">
      <h2 id="kako-naslov">{t('kako.naslov')}</h2>
      <ol className="koraci">
        {KORACI.map((k, i) => (
          <li key={k.ikona} className="korak">
            <span className="korak-broj" aria-hidden="true">
              {i + 1}
            </span>
            <span className="korak-ikona" aria-hidden="true">
              <Ikona ime={k.ikona} velicina={30} />
            </span>
            <strong className="korak-naslov">{t(k.naslov)}</strong>
            <span className="korak-tekst">{t(k.tekst)}</span>
          </li>
        ))}
      </ol>
      <p className="kako-napomena">
        <Ikona ime="admin" velicina={18} />
        {t('kako.napomena')}
      </p>
    </section>
  )
}
