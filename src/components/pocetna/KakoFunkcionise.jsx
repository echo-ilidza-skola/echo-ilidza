// Tri koraka: opiši, označi, prati.

import Ikona from '../Ikona.jsx'

const KORACI = [
  { ikona: 'poruka', naslov: 'Opiši problem', tekst: 'Naslov, kratak opis i fotografija.' },
  { ikona: 'mapa', naslov: 'Označi lokaciju', tekst: 'Klikni na mapu ili koristi GPS.' },
  { ikona: 'kvacica', naslov: 'Prati status', tekst: 'Status ti odgovara kao eho.' },
]

export default function KakoFunkcionise() {
  return (
    <section className="pocetna-kartica kako" aria-labelledby="kako-naslov">
      <h2 id="kako-naslov">Kako funkcioniše ECHO?</h2>
      <ol className="koraci">
        {KORACI.map((k, i) => (
          <li key={k.naslov} className="korak">
            <span className="korak-broj" aria-hidden="true">
              {i + 1}
            </span>
            <span className="korak-ikona" aria-hidden="true">
              <Ikona ime={k.ikona} velicina={30} />
            </span>
            <strong className="korak-naslov">{k.naslov}</strong>
            <span className="korak-tekst">{k.tekst}</span>
          </li>
        ))}
      </ol>
      <p className="kako-napomena">
        <Ikona ime="admin" velicina={18} />
        Prijava postaje javna tek kada je administrator provjeri i odobri.
      </p>
    </section>
  )
}
