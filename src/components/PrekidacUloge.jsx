// Prekidač demo uloge: diskretna ikona osobe koja otvara mali meni s tri uloge.
// Ovo NIJE prijava korisnika ni zaštita podataka – to piše u meniju, u natpisu za čitač ekrana
// i na ekranu O projektu. Trenutna uloga se vidi u meniju (kvačica) i u oblačiću ikone.

import { useEffect, useRef, useState } from 'react'
import { ULOGE } from '../data/konstante.js'
import { useUloga } from '../context/UlogaContext.jsx'
import Ikona from './Ikona.jsx'

export default function PrekidacUloge() {
  const { uloga, promijeniUlogu } = useUloga()
  const [otvoren, postaviOtvoren] = useState(false)
  const okvirRef = useRef(null)
  const dugmeRef = useRef(null)
  const naslov = `Demo uloga: ${ULOGE[uloga]}`

  // Meni se zatvara klikom izvan njega ili tipkom Escape (fokus se vraća na ikonu).
  useEffect(() => {
    if (!otvoren) return undefined
    function klikVani(e) {
      if (!okvirRef.current?.contains(e.target)) postaviOtvoren(false)
    }
    function tipka(e) {
      if (e.key === 'Escape') {
        postaviOtvoren(false)
        dugmeRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', klikVani)
    document.addEventListener('keydown', tipka)
    return () => {
      document.removeEventListener('mousedown', klikVani)
      document.removeEventListener('keydown', tipka)
    }
  }, [otvoren])

  function izaberi(kljuc) {
    promijeniUlogu(kljuc)
    postaviOtvoren(false)
    dugmeRef.current?.focus()
  }

  return (
    <div className="prekidac-uloge" ref={okvirRef}>
      <button
        ref={dugmeRef}
        type="button"
        className="prekidac-dugme"
        aria-expanded={otvoren}
        aria-controls="meni-uloge"
        aria-label={`${naslov} (promijeni ulogu)`}
        title={naslov}
        onClick={() => postaviOtvoren(!otvoren)}
      >
        <Ikona ime="osoba" velicina={20} />
      </button>

      {otvoren && (
        <div id="meni-uloge" className="meni-uloge">
          <p className="meni-uloge-naslov">Demo uloga</p>
          <ul>
            {Object.entries(ULOGE).map(([kljuc, naziv]) => (
              <li key={kljuc}>
                <button type="button" aria-pressed={kljuc === uloga} onClick={() => izaberi(kljuc)}>
                  <span className="meni-uloge-kvacica" aria-hidden="true">
                    {kljuc === uloga && <Ikona ime="kvaka" velicina={16} />}
                  </span>
                  {naziv}
                </button>
              </li>
            ))}
          </ul>
          <p className="meni-uloge-napomena">
            Samo za demonstraciju – nije prijava korisnika ni zaštita podataka. Svi podaci su testni.
          </p>
        </div>
      )}
    </div>
  )
}
