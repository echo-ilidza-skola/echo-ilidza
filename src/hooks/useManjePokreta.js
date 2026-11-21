// Da li je korisnik u postavkama sistema tražio manje pokreta (prefers-reduced-motion).
// Tada aplikacija ne prikazuje animacije koje se ne mogu ugasiti samo CSS-om.

import { useEffect, useState } from 'react'

const UPIT = '(prefers-reduced-motion: reduce)'

export function useManjePokreta() {
  const [manje, postaviManje] = useState(() => typeof window !== 'undefined' && window.matchMedia(UPIT).matches)

  useEffect(() => {
    const upit = window.matchMedia(UPIT)
    const promjena = () => postaviManje(upit.matches)
    upit.addEventListener('change', promjena)
    return () => upit.removeEventListener('change', promjena)
  }, [])

  return manje
}
