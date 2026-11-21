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
      {/* Vidljivo piše kratko "Demo verzija"; puna napomena je u oblačiću (title) i za čitač ekrana,
          a detaljno objašnjenje je na ekranu O projektu. */}
      <p
        id="demo-uloga-napomena"
        className="prekidac-napomena"
        title="Demo uloga služi samo za demonstraciju – nije prijava korisnika ni zaštita podataka."
      >
        Demo verzija
        <span className="vizuelno-skriveno"> – demo uloga nije prijava korisnika ni zaštita podataka</span>
      </p>
    </div>
  )
}
