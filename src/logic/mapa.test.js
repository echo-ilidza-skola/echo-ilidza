import { describe, it, expect } from 'vitest'
import { grupisiZaMapu, povezanePrijave, filtrirajPrijave, projektujTacku, okvirTacaka, tackeToplotneMape } from './mapa.js'

describe('tackeToplotneMape', () => {
  it('pravi [lat, lng, jačina] s brojem prijavitelja kao jačinom', () => {
    expect(tackeToplotneMape([{ lat: 43.8, lng: 18.3, brojPrijavitelja: 3 }])).toEqual([[43.8, 18.3, 3]])
  })

  it('bez broja prijavitelja jačina je 1', () => {
    expect(tackeToplotneMape([{ lat: 43.8, lng: 18.3 }])).toEqual([[43.8, 18.3, 1]])
  })

  it('preskače prijave bez ispravnih koordinata i radi s praznom listom', () => {
    expect(tackeToplotneMape([{ lat: NaN, lng: 18.3 }, { lng: 18.3 }])).toEqual([])
    expect(tackeToplotneMape([])).toEqual([])
  })
})

describe('okvirTacaka', () => {
  const zamjena = { minLat: 1, maxLat: 2, minLng: 3, maxLng: 4 }

  it('prazna lista vraća zamjenu', () => {
    expect(okvirTacaka([], zamjena)).toBe(zamjena)
  })

  it('obuhvata sve tačke uz rezervu', () => {
    const o = okvirTacaka([{ lat: 43.8, lng: 18.3 }, { lat: 43.9, lng: 18.5 }], zamjena, 0.1)
    expect(o.minLat).toBeCloseTo(43.79)
    expect(o.maxLat).toBeCloseTo(43.91)
    expect(o.minLng).toBeCloseTo(18.28)
    expect(o.maxLng).toBeCloseTo(18.52)
  })

  it('jedna tačka dobija mali okvir oko sebe', () => {
    const o = okvirTacaka([{ lat: 43.8, lng: 18.3 }], zamjena, 0.5)
    expect(o.minLat).toBeLessThan(43.8)
    expect(o.maxLat).toBeGreaterThan(43.8)
  })
})

describe('projektujTacku', () => {
  const okvir = { minLat: 43.76, maxLat: 43.88, minLng: 18.2, maxLng: 18.4 }

  it('uglovi okvira idu u uglove slike (sjever gore)', () => {
    expect(projektujTacku({ lat: 43.88, lng: 18.2 }, okvir, 300, 200)).toEqual({ x: 0, y: 0 })
    const dolje = projektujTacku({ lat: 43.76, lng: 18.4 }, okvir, 300, 200)
    expect(dolje.x).toBeCloseTo(300)
    expect(dolje.y).toBeCloseTo(200)
  })

  it('sredina okvira je sredina slike', () => {
    const t = projektujTacku({ lat: 43.82, lng: 18.3 }, okvir, 300, 200)
    expect(t.x).toBeCloseTo(150)
    expect(t.y).toBeCloseTo(100)
  })

  it('tačka izvan okvira se pritegne na rub', () => {
    expect(projektujTacku({ lat: 44.5, lng: 17 }, okvir, 300, 200)).toEqual({ x: 0, y: 0 })
  })
})

const glavna = { id: 'g', kategorija: 'ceste', status: 'U_OBRADI', glavnaPrijavaId: null }
const povezana = { id: 'p', kategorija: 'ceste', status: 'ZAPRIMLJENO', glavnaPrijavaId: 'g' }
const samostalna = { id: 's', kategorija: 'otpad', status: 'RIJESENO', glavnaPrijavaId: null }

describe('grupisiZaMapu', () => {
  it('povezana prijava se ne prikazuje posebno kad je glavna javna', () => {
    expect(grupisiZaMapu([glavna, povezana, samostalna]).map((p) => p.id)).toEqual(['g', 's'])
  })

  it('povezana prijava se prikazuje ako glavna nije javna', () => {
    expect(grupisiZaMapu([povezana, samostalna]).map((p) => p.id)).toEqual(['p', 's'])
  })

  it('prazna lista', () => {
    expect(grupisiZaMapu([])).toEqual([])
  })
})

describe('povezanePrijave', () => {
  it('vraća javne prijave povezane s glavnom', () => {
    expect(povezanePrijave('g', [glavna, povezana, samostalna]).map((p) => p.id)).toEqual(['p'])
    expect(povezanePrijave('s', [glavna, povezana, samostalna])).toEqual([])
  })
})

describe('filtrirajPrijave', () => {
  const sve = [glavna, samostalna]

  it('propušta samo odabrane kategorije i statuse', () => {
    expect(filtrirajPrijave(sve, { kategorije: ['ceste', 'otpad'], statusi: ['U_OBRADI', 'RIJESENO'] })).toHaveLength(2)
    expect(filtrirajPrijave(sve, { kategorije: ['ceste'], statusi: ['U_OBRADI', 'RIJESENO'] }).map((p) => p.id)).toEqual(['g'])
    expect(filtrirajPrijave(sve, { kategorije: ['ceste', 'otpad'], statusi: ['RIJESENO'] }).map((p) => p.id)).toEqual(['s'])
  })

  it('bez odabranih vrijednosti ništa nije prikazano', () => {
    expect(filtrirajPrijave(sve, { kategorije: [], statusi: ['U_OBRADI'] })).toEqual([])
    expect(filtrirajPrijave(sve, { kategorije: ['ceste'], statusi: [] })).toEqual([])
  })
})
