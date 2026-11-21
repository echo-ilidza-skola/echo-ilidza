import { describe, it, expect } from 'vitest'
import { udaljenostM, POLUPRECNIK_ZEMLJE_M } from './udaljenost.js'
import { jeUOkviruIlidze, najblizeNaselje } from './lokacija.js'

// Koliko stepeni geografske širine odgovara zadanom broju metara (po meridijanu).
function metaraUStepeneSirine(metri) {
  return ((metri / POLUPRECNIK_ZEMLJE_M) * 180) / Math.PI
}

describe('udaljenostM (haversine)', () => {
  it('ista tačka je udaljena 0 m', () => {
    expect(udaljenostM({ lat: 43.83, lng: 18.31 }, { lat: 43.83, lng: 18.31 })).toBe(0)
  })

  it('jedan stepen širine je oko 111,19 km', () => {
    expect(udaljenostM({ lat: 43, lng: 18 }, { lat: 44, lng: 18 })).toBeCloseTo(111195, 0)
  })

  it('tačno 50 m po meridijanu', () => {
    const a = { lat: 43.83, lng: 18.31 }
    const b = { lat: 43.83 + metaraUStepeneSirine(50), lng: 18.31 }
    expect(udaljenostM(a, b)).toBeCloseTo(50, 6)
  })

  it('udaljenost je ista u oba smjera', () => {
    const a = { lat: 43.8285, lng: 18.303 }
    const b = { lat: 43.851, lng: 18.3375 }
    expect(udaljenostM(a, b)).toBeCloseTo(udaljenostM(b, a), 9)
  })

  it('Ilidža centar – Hrasnica je nekoliko kilometara', () => {
    const d = udaljenostM({ lat: 43.829, lng: 18.307 }, { lat: 43.797, lng: 18.318 })
    expect(d).toBeGreaterThan(3000)
    expect(d).toBeLessThan(4000)
  })
})

describe('jeUOkviruIlidze', () => {
  it('centar mape je unutar okvira', () => {
    expect(jeUOkviruIlidze({ lat: 43.83, lng: 18.31 })).toBe(true)
  })

  it('rub okvira se računa kao unutra', () => {
    expect(jeUOkviruIlidze({ lat: 43.76, lng: 18.2 })).toBe(true)
    expect(jeUOkviruIlidze({ lat: 43.88, lng: 18.4 })).toBe(true)
  })

  it('centar Sarajeva i Mostar su izvan okvira', () => {
    expect(jeUOkviruIlidze({ lat: 43.859, lng: 18.428 })).toBe(false)
    expect(jeUOkviruIlidze({ lat: 43.343, lng: 17.808 })).toBe(false)
  })

  it('neispravna tačka nije u okviru', () => {
    expect(jeUOkviruIlidze(null)).toBe(false)
    expect(jeUOkviruIlidze({ lat: NaN, lng: 18.3 })).toBe(false)
  })
})

describe('najblizeNaselje', () => {
  it('vraća naselje čije je središte najbliže', () => {
    expect(najblizeNaselje({ lat: 43.7975, lng: 18.3175 })).toBe('Hrasnica')
    expect(najblizeNaselje({ lat: 43.843, lng: 18.246 })).toBe('Blažuj')
    expect(najblizeNaselje({ lat: 43.829, lng: 18.307 })).toBe('Ilidža centar')
  })
})
