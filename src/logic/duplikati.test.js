import { describe, it, expect } from 'vitest'
import { pronadjiMoguceDuplikate } from './duplikati.js'
import { POLUPRECNIK_ZEMLJE_M } from './udaljenost.js'

const CENTAR = { lat: 43.83, lng: 18.31 }

// Tačka koja je zadani broj metara sjevernije od centra.
function sjevernije(metri) {
  return { lat: CENTAR.lat + ((metri / POLUPRECNIK_ZEMLJE_M) * 180) / Math.PI, lng: CENTAR.lng }
}

function prijava(id, metri, izmjene = {}) {
  return { id, kategorija: 'ceste', status: 'ZAPRIMLJENO', glavnaPrijavaId: null, ...sjevernije(metri), ...izmjene }
}

const nova = { kategorija: 'ceste', ...CENTAR }

describe('pronadjiMoguceDuplikate', () => {
  it('pronalazi prijavu iste kategorije bližu od 50 m', () => {
    const r = pronadjiMoguceDuplikate(nova, [prijava('a', 20)])
    expect(r).toHaveLength(1)
    expect(r[0].prijavaId).toBe('a')
    expect(r[0].udaljenostM).toBeCloseTo(20, 2)
  })

  it('tačno 50 m NIJE duplikat, 49,9 m jeste', () => {
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 50)])).toEqual([])
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 49.9)])).toHaveLength(1)
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 50.1)])).toEqual([])
  })

  it('druga kategorija nije duplikat', () => {
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 10, { kategorija: 'otpad' })])).toEqual([])
  })

  it('odbijene i riješene prijave nisu duplikati', () => {
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 10, { status: 'ODBIJENO' })])).toEqual([])
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 10, { status: 'RIJESENO' })])).toEqual([])
  })

  it('ostali statusi se uzimaju u obzir', () => {
    for (const status of ['NA_CEKANJU', 'ZAPRIMLJENO', 'U_OBRADI', 'PROSLIJEDJENO']) {
      expect(pronadjiMoguceDuplikate(nova, [prijava('a', 10, { status })])).toHaveLength(1)
    }
  })

  it('sortira od najbliže', () => {
    const r = pronadjiMoguceDuplikate(nova, [prijava('daleka', 40), prijava('bliska', 5)])
    expect(r.map((x) => x.prijavaId)).toEqual(['bliska', 'daleka'])
  })

  it('za povezanu prijavu predlaže glavnu, i to samo jednom', () => {
    const prijave = [prijava('glavna', 30), prijava('povezana', 10, { glavnaPrijavaId: 'glavna' })]
    const r = pronadjiMoguceDuplikate(nova, prijave)
    expect(r).toHaveLength(1)
    expect(r[0].prijavaId).toBe('glavna')
    expect(r[0].udaljenostM).toBeCloseTo(10, 2)
  })

  it('izuzima zadanu prijavu (poređenje same sa sobom)', () => {
    const r = pronadjiMoguceDuplikate({ ...nova }, [prijava('a', 0)], { izuzmiId: 'a' })
    expect(r).toEqual([])
  })

  it('prazna lista ili nepotpuna nova prijava ne daju prijedlog', () => {
    expect(pronadjiMoguceDuplikate(nova, [])).toEqual([])
    expect(pronadjiMoguceDuplikate(nova, undefined)).toEqual([])
    expect(pronadjiMoguceDuplikate({ kategorija: null, ...CENTAR }, [prijava('a', 5)])).toEqual([])
    expect(pronadjiMoguceDuplikate({ kategorija: 'ceste' }, [prijava('a', 5)])).toEqual([])
  })

  it('prag se može promijeniti', () => {
    expect(pronadjiMoguceDuplikate(nova, [prijava('a', 80)], { prag: 100 })).toHaveLength(1)
  })
})
