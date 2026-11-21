// Javlja kada je element prvi put došao na ekran (ili je već iznad njega).
// Koristi se da se kartice "pojave" tek kad do njih dođemo skrolanjem.
// Ako korisnik naglo preskroluje preko elementa, i to se računa kao "viđeno",
// da nijedan sadržaj ne ostane nevidljiv.

import { useEffect, useRef, useState } from 'react'

export function useVidljivo() {
  const ref = useRef(null)
  const [vidljivo, postaviVidljivo] = useState(false)

  useEffect(() => {
    function provjeri() {
      const element = ref.current
      if (!element) return
      // Gornja ivica elementa je iznad 90 % visine ekrana → element je na ekranu ili iznad njega.
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
        postaviVidljivo(true)
        ukloni()
      }
    }
    function ukloni() {
      window.removeEventListener('scroll', provjeri)
      window.removeEventListener('resize', provjeri)
    }

    window.addEventListener('scroll', provjeri, { passive: true })
    window.addEventListener('resize', provjeri)
    provjeri()
    return ukloni
  }, [])

  return [ref, vidljivo]
}
