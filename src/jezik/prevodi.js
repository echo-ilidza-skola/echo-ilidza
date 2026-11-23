// Prevođenje tekstova interfejsa (bez React koda, pa se koristi i u logici i u testovima).
// Svi tekstovi su u dva rječnika: bs.js (bosanski) i en.js (engleski), s ISTIM ključevima.
//
//   prevedi('en', 'mapa.naslov')                      -> "Map of reports"
//   prevedi('bs', 'mapa.prikazano', { broj: 3, ukupno: 19 })  -> "Prikazano 3 od 19 oznaka"
//
// Ako ključ ne postoji u izabranom jeziku, koristi se bosanski; ako ne postoji ni tamo,
// vraća se sam ključ (da se greška odmah vidi na ekranu).

import bs from './bs.js'
import en from './en.js'

export const RJECNICI = { bs, en }
export const JEZICI = ['bs', 'en']
export const POCETNI_JEZIK = 'bs'

// Kratke oznake jezika za dugmad u zaglavlju i puni nazivi za čitač ekrana.
export const OZNAKE_JEZIKA = {
  bs: { kratko: 'BS', puno: 'Bosanski' },
  en: { kratko: 'EN', puno: 'English' },
}

// Vrijednost iz ugniježđenog objekta po ključu s tačkama: "mapa.naslov" -> rjecnik.mapa.naslov
function procitaj(rjecnik, kljuc) {
  return kljuc.split('.').reduce((dio, k) => (dio && dio[k] !== undefined ? dio[k] : undefined), rjecnik)
}

export function jeIspravanJezik(jezik) {
  return JEZICI.includes(jezik)
}

export function prevedi(jezik, kljuc, parametri = {}) {
  const rjecnik = RJECNICI[jezik] || RJECNICI[POCETNI_JEZIK]
  let tekst = procitaj(rjecnik, kljuc)
  if (tekst === undefined) tekst = procitaj(RJECNICI[POCETNI_JEZIK], kljuc)
  if (tekst === undefined) return kljuc
  if (typeof tekst !== 'string') return tekst
  // Zamjena {ime} vrijednostima iz parametara. Vrijednost koja počinje s "@" je i sama ključ
  // (npr. "@statusi.U_OBRADI"), pa se i ona prevede – tako i dijelovi poruke budu na izabranom jeziku.
  return tekst.replace(/\{(\w+)\}/g, (cijelo, ime) => {
    const vrijednost = parametri[ime]
    if (vrijednost === undefined) return cijelo
    if (typeof vrijednost === 'string' && vrijednost.startsWith('@')) return prevedi(jezik, vrijednost.slice(1))
    return String(vrijednost)
  })
}

// Svi ključevi rječnika kao lista "a.b.c" (koristi test koji provjerava da oba jezika imaju iste ključeve).
export function sviKljucevi(rjecnik, prefiks = '') {
  return Object.entries(rjecnik).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? sviKljucevi(v, `${prefiks}${k}.`) : [`${prefiks}${k}`],
  )
}
