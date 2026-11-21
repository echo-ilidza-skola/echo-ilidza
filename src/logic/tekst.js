// Pomoćne funkcije za rad s tekstom: normalizacija i traženje ključnih riječi.
// Ovo su obična PRAVILA (poređenje riječi), ne AI.

// Zamjena slova s dijakriticima. "đ" pišemo kao "dj" jer ljudi bez naših slova
// najčešće tako pišu (npr. "djubre").
const BEZ_DIJAKRITIKA = { č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'dj' }

// Mala slova, bez dijakritika, samo slova i razmaci.
// Primjer: "Udarna RUPA, opasno!" -> "udarna rupa opasno"
export function normalizujTekst(tekst) {
  if (typeof tekst !== 'string') return ''
  return tekst
    .toLowerCase()
    .replace(/[čćšžđ]/g, (slovo) => BEZ_DIJAKRITIKA[slovo])
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const SAMOGLASNICI = 'aeiou'

// Korijen riječi: duža riječ koja završava samoglasnikom gubi zadnje slovo,
// pa "rupa" pronalazi i "rupe", "rupu", "rupom".
export function korijenRijeci(rijec) {
  if (rijec.length >= 4 && SAMOGLASNICI.includes(rijec[rijec.length - 1])) {
    return rijec.slice(0, -1)
  }
  return rijec
}

// Pravi regularni izraz za ključnu riječ ili frazu.
// Svaka riječ mora početi na početku riječi u tekstu (zato "rupa" NE pronalazi "grupa").
function izrazZaKljucnuRijec(kljucnaRijec) {
  const dijelovi = normalizujTekst(kljucnaRijec)
    .split(' ')
    .filter(Boolean)
    .map((r) => korijenRijeci(r) + '[a-z]*')
  return new RegExp('\\b' + dijelovi.join(' ') + '\\b', 'g')
}

// Broji koliko puta se svaka ključna riječ pojavljuje u tekstu.
// Vraća samo pronađene riječi: [{ rijec: 'rupa', broj: 2 }, ...]
export function pronadjiKljucneRijeci(tekst, kljucneRijeci) {
  const normalizovan = normalizujTekst(tekst)
  if (!normalizovan) return []

  const rezultat = []
  for (const rijec of kljucneRijeci) {
    const pogoci = normalizovan.match(izrazZaKljucnuRijec(rijec))
    if (pogoci) rezultat.push({ rijec, broj: pogoci.length })
  }
  return rezultat
}
