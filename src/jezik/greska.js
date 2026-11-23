// Greške koje se mogu prikazati na oba jezika.
// Logika baca grešku s porukom na bosanskom (kao i ranije), ali greška pamti i KLJUČ prevoda,
// pa je ekran može prikazati na izabranom jeziku.

import { prevedi } from './prevodi.js'

export function napraviGresku(kljuc, parametri = {}) {
  const greska = new Error(prevedi('bs', kljuc, parametri))
  greska.kljuc = kljuc
  greska.parametri = parametri
  return greska
}

// Tekst greške na izabranom jeziku (greška bez ključa ostaje kakva jeste).
export function tekstGreske(greska, jezik = 'bs') {
  if (!greska) return null
  if (greska.kljuc) return prevedi(jezik, greska.kljuc, greska.parametri)
  return greska.message || String(greska)
}
