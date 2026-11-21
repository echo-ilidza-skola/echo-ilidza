// Broj koji se "odbrojava" od 0 do cilja kad je "aktivno" true.
// Uz "manje pokreta" odmah prikazuje konačan broj.

import { useEffect, useState } from 'react'
import { useManjePokreta } from './useManjePokreta.js'
import { vrijednostBrojanja } from '../logic/animacija.js'

const TRAJANJE_MS = 1400

export function useBrojanje(cilj, aktivno = true) {
  const manjePokreta = useManjePokreta()
  const [vrijednost, postaviVrijednost] = useState(manjePokreta ? cilj : 0)

  useEffect(() => {
    if (manjePokreta || !aktivno) {
      postaviVrijednost(manjePokreta ? cilj : 0)
      return
    }
    let okvir
    const pocetak = performance.now()
    function korak(sada) {
      const napredak = Math.min(1, (sada - pocetak) / TRAJANJE_MS)
      postaviVrijednost(vrijednostBrojanja(cilj, napredak))
      if (napredak < 1) okvir = requestAnimationFrame(korak)
    }
    okvir = requestAnimationFrame(korak)
    return () => cancelAnimationFrame(okvir)
  }, [cilj, aktivno, manjePokreta])

  return vrijednost
}
