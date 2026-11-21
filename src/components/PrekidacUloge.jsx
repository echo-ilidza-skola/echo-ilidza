// Prekidač demo uloge. Jasno piše da ovo NIJE prijava korisnika ni zaštita podataka.

import { ULOGE } from '../data/konstante.js'
import { useUloga } from '../context/UlogaContext.jsx'
import Ikona from './Ikona.jsx'

export default function PrekidacUloge() {
  const { uloga, promijeniUlogu } = useUloga()

  return (
    <div className="prekidac-uloge">
      <div className="prekidac-polje">
        <Ikona ime="osoba" velicina={18} className="prekidac-ikona" />
        <label htmlFor="demo-uloga" className="vizuelno-skriveno">
          Demo uloga
        </label>
        <select
          id="demo-uloga"
          value={uloga}
          onChange={(e) => promijeniUlogu(e.target.value)}
          aria-describedby="demo-uloga-napomena"
        >
          {Object.entries(ULOGE).map(([kljuc, naziv]) => (
            <option key={kljuc} value={kljuc}>
              {naziv}
            </option>
          ))}
        </select>
      </div>
      <p id="demo-uloga-napomena" className="prekidac-napomena">
        Demo uloga – nije prijava ni zaštita podataka
      </p>
    </div>
  )
}
