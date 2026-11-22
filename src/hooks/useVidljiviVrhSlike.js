// Prati veličinu hero slike i koliko je zaglavlje prekriva, i vraća prvi red slike
// (u pikselima slike) koji se vidi ispod zaglavlja. Računanje je u src/logic/heroSlika.js.

import { useEffect, useRef, useState } from 'react'
import { prviVidljiviRed } from '../logic/heroSlika.js'

export function useVidljiviVrhSlike() {
  const ref = useRef(null)
  const [vrh, postaviVrh] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    function izracunaj() {
      const okvir = element.getBoundingClientRect()
      const zaglavlje = document.querySelector('.zaglavlje')
      // Koliko zaglavlje prekriva vrh slike (na mobitelu je iznad slike, pa je preklop 0).
      const preklop = zaglavlje ? Math.max(0, zaglavlje.getBoundingClientRect().bottom - okvir.top) : 0
      postaviVrh(prviVidljiviRed(okvir.width, okvir.height, Math.min(preklop, okvir.height)))
    }

    izracunaj()
    const posmatrac = new ResizeObserver(izracunaj)
    posmatrac.observe(element)
    return () => posmatrac.disconnect()
  }, [])

  return [ref, vrh]
}
