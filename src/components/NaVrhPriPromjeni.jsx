// Pri svakoj promjeni rute pomjeri prikaz na vrh stranice.
// Izuzetak: povratak dugmetom "nazad" ili "naprijed" (POP) – tada preglednik sam vraća
// raniju poziciju, pa je ne diramo.

import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export default function NaVrhPriPromjeni() {
  const { pathname } = useLocation()
  const vrsta = useNavigationType()

  useLayoutEffect(() => {
    if (vrsta === 'POP') return
    window.scrollTo(0, 0)
  }, [pathname, vrsta])

  return null
}
