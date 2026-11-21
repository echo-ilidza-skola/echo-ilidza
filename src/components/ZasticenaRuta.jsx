// Prikazuje ekran samo ako je odabrana odgovarajuća DEMO uloga.
// Ovo NIJE zaštita podataka: svako može promijeniti ulogu u zaglavlju.

import { ULOGE } from '../data/konstante.js'
import { useUloga } from '../context/UlogaContext.jsx'

export default function ZasticenaRuta({ uloge, children }) {
  const { uloga, promijeniUlogu } = useUloga()

  if (uloge.includes(uloga)) return children

  const potrebna = uloge[0]
  return (
    <section className="kartica">
      <h1>Ovaj ekran je za demo ulogu „{ULOGE[potrebna]}“</h1>
      <p>
        Trenutno je odabrana uloga „{ULOGE[uloga]}“. Ulogu možete promijeniti u zaglavlju ili
        dugmetom ispod.
      </p>
      <p className="prigusen">
        Demo uloge su samo demonstracija. One nisu prijava korisnika ni zaštita podataka.
      </p>
      <button type="button" className="dugme" onClick={() => promijeniUlogu(potrebna)}>
        Prebaci na ulogu „{ULOGE[potrebna]}“
      </button>
    </section>
  )
}
