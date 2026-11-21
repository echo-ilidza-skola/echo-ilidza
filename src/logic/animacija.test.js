import { describe, it, expect } from 'vitest'
import { easeOut, vrijednostBrojanja } from './animacija.js'

describe('easeOut', () => {
  it('počinje u 0 i završava u 1', () => {
    expect(easeOut(0)).toBe(0)
    expect(easeOut(1)).toBe(1)
  })

  it('na pola puta je već preko pola (brzo pa polako)', () => {
    expect(easeOut(0.5)).toBeGreaterThan(0.5)
  })

  it('vrijednosti izvan 0–1 se ograniče', () => {
    expect(easeOut(-1)).toBe(0)
    expect(easeOut(2)).toBe(1)
  })
})

describe('vrijednostBrojanja', () => {
  it('ide od 0 do cilja kao cijeli broj', () => {
    expect(vrijednostBrojanja(21, 0)).toBe(0)
    expect(vrijednostBrojanja(21, 1)).toBe(21)
    expect(Number.isInteger(vrijednostBrojanja(21, 0.3))).toBe(true)
  })

  it('cilj 0 ostaje 0', () => {
    expect(vrijednostBrojanja(0, 0.5)).toBe(0)
  })
})
