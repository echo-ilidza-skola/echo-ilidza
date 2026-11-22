import { describe, it, expect } from 'vitest'
import { prviVidljiviRed } from './heroSlika.js'

describe('prviVidljiviRed', () => {
  it('kad se slika vidi cijela (mobitel), prvi red je 0', () => {
    // Okvir istih proporcija kao slika.
    expect(prviVidljiviRed(836, 470.5)).toBeCloseTo(0)
  })

  it('na širokom ekranu vrh slike je odsječen', () => {
    // 1672 × 641: mjerilo 1, vidi se donjih 641 redova.
    expect(prviVidljiviRed(1672, 641)).toBeCloseTo(300)
  })

  it('dodaje dio koji prekriva zaglavlje (pretvoren u piksele slike)', () => {
    // Mjerilo 2: 70 px zaglavlja = 35 redova slike.
    expect(prviVidljiviRed(3344, 1282, 70)).toBeCloseTo(300 + 35)
  })

  it('bez veličine okvira vraća 0', () => {
    expect(prviVidljiviRed(0, 0)).toBe(0)
  })
})
