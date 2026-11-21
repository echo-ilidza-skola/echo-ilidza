import { describe, it, expect } from 'vitest'
import { grupisiZaMapu, povezanePrijave, filtrirajPrijave } from './mapa.js'

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
