import { describe, it, expect } from 'vitest'
import bs from './bs.js'
import en from './en.js'
import { prevedi, sviKljucevi } from './prevodi.js'
import { napraviGresku, tekstGreske } from './greska.js'
import { nazivStatusa, nazivKategorije } from '../data/konstante.js'

// Mjesta za vrijednosti u tekstu, npr. {broj}.
function mjesta(tekst) {
  return [...String(tekst).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
}

describe('rječnici bs i en', () => {
  const kljuceviBs = sviKljucevi(bs)
  const kljuceviEn = sviKljucevi(en)

  it('imaju iste ključeve', () => {
    expect(kljuceviEn.sort()).toEqual(kljuceviBs.sort())
  })

  it('nijedan tekst nije prazan', () => {
    for (const k of kljuceviBs) {
      expect(prevedi('bs', k).trim(), k).not.toBe('')
      expect(prevedi('en', k).trim(), k).not.toBe('')
    }
  })

  it('u oba jezika su ista mjesta za vrijednosti ({broj}, {naslov}…)', () => {
    for (const k of kljuceviBs) {
      const izvorniBs = k.split('.').reduce((o, d) => o[d], bs)
      const izvorniEn = k.split('.').reduce((o, d) => o[d], en)
      expect(mjesta(izvorniEn), k).toEqual(mjesta(izvorniBs))
    }
  })

  it('pravilo iz CLAUDE.md: oznaka prijedloga i "(simulacija)"', () => {
    expect(prevedi('bs', 'pravila.oznaka')).toBe('Prijedlog na osnovu ključnih riječi (pravila, ne AI)')
    expect(prevedi('en', 'pravila.oznaka')).toContain('not AI')
    expect(prevedi('bs', 'statusi.PROSLIJEDJENO')).toContain('(simulacija)')
    expect(prevedi('en', 'statusi.PROSLIJEDJENO')).toContain('(simulation)')
    expect(prevedi('bs', 'pp.napomena')).toBe('Orijentacioni prijedlog, nije procjena stvarne opasnosti.')
  })
})

describe('prevedi', () => {
  it('ubacuje vrijednosti i prevodi vrijednosti koje počinju s "@"', () => {
    expect(prevedi('en', 'mapa.prijavitelja', { broj: 3 })).toBe('Reporters: 3')
    expect(prevedi('en', 'greske.promjenaStatusa', { od: '@statusi.RIJESENO', u: '@statusi.NA_CEKANJU' })).toBe(
      'A change from “Resolved” to “Awaiting review” is not allowed.',
    )
  })

  it('nepoznat jezik koristi bosanski, nepoznat ključ vraća sam ključ', () => {
    expect(prevedi('de', 'nav.mapa')).toBe('Mapa')
    expect(prevedi('en', 'ne.postoji')).toBe('ne.postoji')
  })

  it('nazivi statusa i kategorija na oba jezika', () => {
    expect(nazivStatusa('U_OBRADI')).toBe('U obradi')
    expect(nazivStatusa('U_OBRADI', 'en')).toBe('In progress')
    expect(nazivKategorije('ceste', 'en')).toBe('Roads and sidewalks')
  })
})

describe('greške na oba jezika', () => {
  it('poruka je na bosanskom, a tekstGreske daje izabrani jezik', () => {
    const g = napraviGresku('greske.nemaPrijave')
    expect(g.message).toBe('Prijava ne postoji.')
    expect(tekstGreske(g, 'en')).toBe('The report does not exist.')
    expect(tekstGreske(new Error('obična greška'), 'en')).toBe('obična greška')
  })
})
