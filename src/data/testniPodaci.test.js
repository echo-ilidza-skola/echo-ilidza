import { describe, it, expect } from 'vitest'
import { napraviTestnePodatke } from './testniPodaci.js'
import {
  STATUSI,
  KATEGORIJE,
  NASELJA,
  OKVIR_ILIDZE,
  DEMO_KORISNIK_ID,
  MAX_NASLOV,
  MAX_OPIS,
} from './konstante.js'

const SADA = new Date('2026-11-21T12:00:00Z')
const prijave = napraviTestnePodatke(SADA)

describe('testni podaci', () => {
  it('ima tačno 28 prijava s jedinstvenim id-jem', () => {
    expect(prijave).toHaveLength(28)
    expect(new Set(prijave.map((p) => p.id)).size).toBe(28)
  })

  it('svaka prijava je označena kao testni podatak', () => {
    expect(prijave.every((p) => p.testniPodatak === true)).toBe(true)
    expect(prijave.every((p) => p.opcina === 'ilidza')).toBe(true)
  })

  it('pokriva sve statuse, sve kategorije i sva naselja', () => {
    const statusi = new Set(prijave.map((p) => p.status))
    const kategorije = new Set(prijave.map((p) => p.kategorija))
    const naselja = new Set(prijave.map((p) => p.naselje))
    expect([...statusi].sort()).toEqual(Object.keys(STATUSI).sort())
    expect([...kategorije].sort()).toEqual(KATEGORIJE.map((k) => k.kljuc).sort())
    expect([...naselja].sort()).toEqual(NASELJA.map((n) => n.naziv).sort())
  })

  it('datumi su u posljednjih 90 dana i nisu u budućnosti', () => {
    const granica = SADA.getTime() - 90 * 24 * 60 * 60 * 1000
    for (const p of prijave) {
      const t = new Date(p.datumPrijave).getTime()
      expect(t).toBeGreaterThanOrEqual(granica)
      expect(t).toBeLessThanOrEqual(SADA.getTime())
    }
  })

  it('sve lokacije su unutar približnog okvira Ilidže', () => {
    for (const p of prijave) {
      expect(p.lat).toBeGreaterThanOrEqual(OKVIR_ILIDZE.minLat)
      expect(p.lat).toBeLessThanOrEqual(OKVIR_ILIDZE.maxLat)
      expect(p.lng).toBeGreaterThanOrEqual(OKVIR_ILIDZE.minLng)
      expect(p.lng).toBeLessThanOrEqual(OKVIR_ILIDZE.maxLng)
    }
  })

  it('naslov i opis poštuju dužine iz obrasca', () => {
    for (const p of prijave) {
      expect(p.naslov.length).toBeGreaterThan(0)
      expect(p.naslov.length).toBeLessThanOrEqual(MAX_NASLOV)
      expect(p.opis.length).toBeGreaterThan(0)
      expect(p.opis.length).toBeLessThanOrEqual(MAX_OPIS)
    }
  })

  it('historija počinje s NA_CEKANJU, završava trenutnim statusom i ide redom kroz vrijeme', () => {
    for (const p of prijave) {
      const h = p.historijaStatusa
      expect(h[0].status).toBe('NA_CEKANJU')
      expect(h[h.length - 1].status).toBe(p.status)
      for (let i = 1; i < h.length; i++) {
        expect(new Date(h[i].datum).getTime()).toBeGreaterThanOrEqual(new Date(h[i - 1].datum).getTime())
      }
    }
  })

  it('odbijene prijave imaju razlog, ostale nemaju', () => {
    for (const p of prijave) {
      if (p.status === 'ODBIJENO') expect(p.razlogOdbijanja).toBeTruthy()
      else expect(p.razlogOdbijanja).toBeNull()
    }
  })

  it('potvrđeni prioritet ne postoji dok prijava čeka provjeru', () => {
    for (const p of prijave.filter((p) => p.status === 'NA_CEKANJU')) {
      expect(p.potvrdjeniPrioritet).toBeNull()
    }
  })

  it('ima bar 2 grupe povezanih prijava iste kategorije', () => {
    const povezane = prijave.filter((p) => p.glavnaPrijavaId)
    const glavneIds = new Set(povezane.map((p) => p.glavnaPrijavaId))
    expect(glavneIds.size).toBeGreaterThanOrEqual(2)
    for (const p of povezane) {
      const glavna = prijave.find((g) => g.id === p.glavnaPrijavaId)
      expect(glavna).toBeTruthy()
      expect(glavna.glavnaPrijavaId).toBeNull()
      expect(glavna.kategorija).toBe(p.kategorija)
    }
    // Broj prijavitelja glavne prijave je bar 1 + broj povezanih prijava.
    for (const id of glavneIds) {
      const glavna = prijave.find((g) => g.id === id)
      const brojPovezanih = povezane.filter((p) => p.glavnaPrijavaId === id).length
      expect(glavna.brojPrijavitelja).toBeGreaterThanOrEqual(1 + brojPovezanih)
    }
  })

  it('demo građanin ima prijave na čekanju, odbijene i javne', () => {
    const moje = prijave.filter((p) => p.autorId === DEMO_KORISNIK_ID)
    const statusi = new Set(moje.map((p) => p.status))
    expect(statusi.has('NA_CEKANJU')).toBe(true)
    expect(statusi.has('ODBIJENO')).toBe(true)
    expect(moje.some((p) => STATUSI[p.status].javno)).toBe(true)
  })

  it('nema fotografija preuzetih s interneta', () => {
    expect(prijave.every((p) => p.fotografijaId === null)).toBe(true)
  })
})
