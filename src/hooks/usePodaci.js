// Hook koji čita podatke preko funkcije iz storage.js
// i ponovo ih čita kad god se podaci promijene.
//
// Primjer:  const prijave = usePodaci(javnePrijave)

import { useEffect, useRef, useState } from 'react'
import { DOGADJAJ_PROMJENE } from '../data/storage.js'

export function usePodaci(citac) {
  const [vrijednost, postaviVrijednost] = useState(() => citac())

  // Pamtimo najnoviju funkciju za čitanje, da ne moramo ponovo dodavati osluškivače.
  const citacRef = useRef(citac)
  citacRef.current = citac

  useEffect(() => {
    function osvjezi() {
      postaviVrijednost(citacRef.current())
    }
    osvjezi()
    window.addEventListener(DOGADJAJ_PROMJENE, osvjezi)
    // 'storage' stiže kad se podaci promijene u DRUGOJ kartici istog preglednika.
    window.addEventListener('storage', osvjezi)
    return () => {
      window.removeEventListener(DOGADJAJ_PROMJENE, osvjezi)
      window.removeEventListener('storage', osvjezi)
    }
  }, [])

  return vrijednost
}
