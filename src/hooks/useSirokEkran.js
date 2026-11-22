// Da li je ekran širok kao računar (isti prag kao u global.css: 960 px).
// Koristi se kad se nešto mora razlikovati i u JavaScriptu, a ne samo u CSS-u.

import { useEffect, useState } from 'react'

const UPIT = '(min-width: 960px)'

export function useSirokEkran() {
  const [sirok, postaviSirok] = useState(() => typeof window !== 'undefined' && window.matchMedia(UPIT).matches)

  useEffect(() => {
    const upit = window.matchMedia(UPIT)
    const promjena = () => postaviSirok(upit.matches)
    upit.addEventListener('change', promjena)
    return () => upit.removeEventListener('change', promjena)
  }, [])

  return sirok
}
