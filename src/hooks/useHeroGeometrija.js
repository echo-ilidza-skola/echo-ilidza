// Prati hero sliku i vraća (u pikselima slike):
//   vidljiviVrh – prvi red slike koji se vidi ispod zaglavlja,
//   tekst – gdje na slici stoji tekst uvodnog dijela (naslov, opis, dugme), ili null.
// Računanje je u src/logic/heroSlika.js; ovdje se samo mjeri ekran.

import { useEffect, useRef, useState } from 'react'
import { prviVidljiviRed, pravougaonikUSliku } from '../logic/heroSlika.js'

export function useHeroGeometrija() {
  const ref = useRef(null)
  const [geometrija, postaviGeometriju] = useState({ vidljiviVrh: 0, tekst: null })

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    const tekstElement = document.querySelector('.hero-tekst')

    function izracunaj() {
      const okvir = element.getBoundingClientRect()
      if (!okvir.width || !okvir.height) return
      const zaglavlje = document.querySelector('.zaglavlje')
      // Koliko zaglavlje prekriva vrh slike (na mobitelu je iznad slike, pa je preklop 0).
      const preklop = zaglavlje ? Math.max(0, zaglavlje.getBoundingClientRect().bottom - okvir.top) : 0
      let tekst = null
      if (tekstElement) {
        const t = tekstElement.getBoundingClientRect()
        tekst = pravougaonikUSliku(
          { lijevo: t.left - okvir.left, desno: t.right - okvir.left, gore: t.top - okvir.top, dolje: t.bottom - okvir.top },
          okvir.width,
          okvir.height,
        )
      }
      postaviGeometriju({
        vidljiviVrh: prviVidljiviRed(okvir.width, okvir.height, Math.min(preklop, okvir.height)),
        tekst,
      })
    }

    izracunaj()
    // Ponovo računamo kad se promijeni veličina slike ili teksta (npr. kad se učita font).
    const posmatrac = new ResizeObserver(izracunaj)
    posmatrac.observe(element)
    if (tekstElement) posmatrac.observe(tekstElement)
    return () => posmatrac.disconnect()
  }, [])

  return [ref, geometrija]
}
