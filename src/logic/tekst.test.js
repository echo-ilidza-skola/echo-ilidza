import { describe, it, expect } from 'vitest'
import { normalizujTekst, korijenRijeci, pronadjiKljucneRijeci, escapeHtml } from './tekst.js'

describe('escapeHtml', () => {
  it('pretvara HTML znakove u bezopasan tekst', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')
    expect(escapeHtml("Tom & Jerry's")).toBe('Tom &amp; Jerry&#39;s')
  })

  it('obični tekst s dijakriticima ostaje isti', () => {
    expect(escapeHtml('Rupa kod škole')).toBe('Rupa kod škole')
  })

  it('null i undefined daju prazan tekst', () => {
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(undefined)).toBe('')
  })
})

describe('normalizujTekst', () => {
  it('pravi mala slova i uklanja dijakritike', () => {
    expect(normalizujTekst('ČAĆA Šuma Žaba Đak')).toBe('caca suma zaba djak')
  })

  it('uklanja interpunkciju i višak razmaka', () => {
    expect(normalizujTekst('  Rupa,   opasno!!! ')).toBe('rupa opasno')
  })

  it('prazan tekst i ne-tekst daju prazan string', () => {
    expect(normalizujTekst('')).toBe('')
    expect(normalizujTekst('   ')).toBe('')
    expect(normalizujTekst(null)).toBe('')
    expect(normalizujTekst(undefined)).toBe('')
  })
})

describe('korijenRijeci', () => {
  it('skida zadnji samoglasnik duže riječi', () => {
    expect(korijenRijeci('rupa')).toBe('rup')
    expect(korijenRijeci('lampa')).toBe('lamp')
  })

  it('ne dira kratke riječi ni riječi koje završavaju suglasnikom', () => {
    expect(korijenRijeci('ne')).toBe('ne')
    expect(korijenRijeci('pao')).toBe('pao')
    expect(korijenRijeci('most')).toBe('most')
  })
})

describe('pronadjiKljucneRijeci', () => {
  it('pronalazi riječ s dijakriticima i bez njih', () => {
    expect(pronadjiKljucneRijeci('Puno smeće', ['smeće'])).toEqual([{ rijec: 'smeće', broj: 1 }])
    expect(pronadjiKljucneRijeci('puno smece', ['smeće'])).toEqual([{ rijec: 'smeće', broj: 1 }])
    expect(pronadjiKljucneRijeci('djubre svuda', ['đubre'])).toEqual([{ rijec: 'đubre', broj: 1 }])
  })

  it('pronalazi padeže ("rupe", "rupu") i broji svako pojavljivanje', () => {
    expect(pronadjiKljucneRijeci('Rupa pa još jedna rupu i rupe', ['rupa'])).toEqual([{ rijec: 'rupa', broj: 3 }])
  })

  it('ne pronalazi riječ unutar druge riječi', () => {
    expect(pronadjiKljucneRijeci('grupa djece', ['rupa'])).toEqual([])
  })

  it('pronalazi fraze od više riječi', () => {
    expect(pronadjiKljucneRijeci('Lampa ne svijetli', ['ne svijetli'])).toEqual([{ rijec: 'ne svijetli', broj: 1 }])
    expect(pronadjiKljucneRijeci('Otvoreni šaht', ['otvoren šaht'])).toEqual([{ rijec: 'otvoren šaht', broj: 1 }])
  })

  it('prazan tekst nema pogodaka', () => {
    expect(pronadjiKljucneRijeci('', ['rupa'])).toEqual([])
    expect(pronadjiKljucneRijeci('   ', ['rupa'])).toEqual([])
  })
})
