// Prekidač demo uloge. Jasno piše da ovo NIJE prijava korisnika ni zaštita podataka.

import { ULOGE } from '../data/konstante.js'
import { useUloga } from '../context/UlogaContext.jsx'

export default function PrekidacUloge() {
  const { uloga, promijeniUlogu } = useUloga()

  return (
    <div className="prekidac-uloge">
      <label htmlFor="demo-uloga">Demo uloga</label>
      <select id="demo-uloga" value={uloga} onChange={(e) => promijeniUlogu(e.target.value)} aria-describedby="demo-uloga-napomena">
        {Object.entries(ULOGE).map(([kljuc, naziv]) => (
          <option key={kljuc} value={kljuc}>
            {naziv}
          </option>
        ))}
      </select>
      <p id="demo-uloga-napomena" className="prekidac-napomena">
        Samo demonstracija – nije prijava korisnika ni zaštita podataka.
      </p>
    </div>
  )
}
