import { describe, it, expect } from 'vitest'
import { ehoZaStatus, opisEha, lukoviZaPrijavitelje, BROJ_LUKOVA } from './ehoStatus.js'

describe('ehoZaStatus', () => {
  it('svaki javni status pali jedan luk više', () => {
    expect(ehoZaStatus('ZAPRIMLJENO').upaljeno).toBe(1)
    expect(ehoZaStatus('U_OBRADI').upaljeno).toBe(2)
    expect(ehoZaStatus('PROSLIJEDJENO').upaljeno).toBe(3)
    expect(ehoZaStatus('RIJESENO').upaljeno).toBe(BROJ_LUKOVA)
    expect(ehoZaStatus('RIJESENO').rijeseno).toBe(true)
  })

  it('na čekanju i odbijeno nemaju upaljenih lukova', () => {
    expect(ehoZaStatus('NA_CEKANJU')).toEqual({ upaljeno: 0, naCekanju: true, odbijeno: false, rijeseno: false })
    expect(ehoZaStatus('ODBIJENO')).toEqual({ upaljeno: 0, naCekanju: false, odbijeno: true, rijeseno: false })
  })
})

describe('opisEha', () => {
  it('kaže naziv statusa i korak', () => {
    expect(opisEha('U_OBRADI')).toBe('Status: U obradi, korak 2 od 4')
    expect(opisEha('PROSLIJEDJENO')).toBe('Status: Proslijeđeno službi (simulacija), korak 3 od 4')
    expect(opisEha('NA_CEKANJU')).toBe('Status: Na čekanju provjere, još nije zaprimljeno')
    expect(opisEha('ODBIJENO')).toBe('Status: Odbijeno')
  })
})

describe('lukoviZaPrijavitelje', () => {
  it('1 prijavitelj: bez lukova', () => {
    expect(lukoviZaPrijavitelje(1)).toBe(0)
  })
  it('2–3 prijavitelja: 1 luk', () => {
    expect(lukoviZaPrijavitelje(2)).toBe(1)
    expect(lukoviZaPrijavitelje(3)).toBe(1)
  })
  it('4–6 prijavitelja: 2 luka', () => {
    expect(lukoviZaPrijavitelje(4)).toBe(2)
    expect(lukoviZaPrijavitelje(6)).toBe(2)
  })
  it('7 i više: 3 luka', () => {
    expect(lukoviZaPrijavitelje(7)).toBe(3)
    expect(lukoviZaPrijavitelje(30)).toBe(3)
  })
  it('neispravan broj: bez lukova', () => {
    expect(lukoviZaPrijavitelje(undefined)).toBe(0)
  })
})
