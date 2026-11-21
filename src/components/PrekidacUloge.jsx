// Prekidač demo uloge. Jasno piše da ovo NIJE prijava korisnika ni zaštita podataka.

import { ULOGE } from '../data/konstante.js'
import { useUloga } from '../context/UlogaContext.jsx'

export default function PrekidacUloge() {
  const { uloga, promijeniUlogu } = useUloga()

  return (
    <fieldset className="prekidac-uloge">
      <legend>Demo uloga</legend>
      <div className="prekidac-opcije">
        {Object.entries(ULOGE).map(([kljuc, naziv]) => (
          <label key={kljuc} className={kljuc === uloga ? 'opcija aktivna' : 'opcija'}>
            <input
              type="radio"
              name="demo-uloga"
              value={kljuc}
              checked={kljuc === uloga}
              onChange={() => promijeniUlogu(kljuc)}
            />
            {naziv}
          </label>
        ))}
      </div>
      <p className="prekidac-napomena">Samo demonstracija – nije prijava korisnika ni zaštita podataka.</p>
    </fieldset>
  )
}
