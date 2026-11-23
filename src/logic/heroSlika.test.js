import { describe, it, expect } from 'vitest'
import { prviVidljiviRed, pravougaonikUSliku, rasporediOznake } from './heroSlika.js'

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

describe('pravougaonikUSliku', () => {
  it('pretvara mjere s ekrana u piksele slike (mjerilo 2, odsječen vrh)', () => {
    // Okvir 3344 × 1282: mjerilo 2, slika visoka 1882 px, pa je odsječeno 600 px odozgo.
    const p = pravougaonikUSliku({ lijevo: 100, desno: 300, gore: 0, dolje: 200 }, 3344, 1282)
    expect(p).toEqual({ lijevo: 50, desno: 150, gore: 300, dolje: 400 })
  })
})

describe('rasporediOznake', () => {
  const mjere = { sirinaOznake: 24, visinaOznake: 34, razmak: 10 }

  it('oznaku ispod zaglavlja ne dira', () => {
    expect(rasporediOznake([{ x: 100, y: 500 }], { najvisiVrh: 200, tekst: null, ...mjere })).toEqual([{ x: 100, y: 500 }])
  })

  it('oznaku koju bi pokrilo zaglavlje spušta tačno ispod njega', () => {
    expect(rasporediOznake([{ x: 100, y: 150 }], { najvisiVrh: 200, tekst: null, ...mjere })).toEqual([{ x: 100, y: 200 }])
  })

  it('oznaku koja bi pala na tekst podiže iznad teksta', () => {
    const tekst = { lijevo: 0, desno: 400, gore: 400, dolje: 700 }
    expect(rasporediOznake([{ x: 100, y: 420 }], { najvisiVrh: 200, tekst, ...mjere })).toEqual([{ x: 100, y: 390 }])
  })

  it('oznaku izostavlja ako iznad teksta nema mjesta', () => {
    const tekst = { lijevo: 0, desno: 400, gore: 205, dolje: 700 } // iznad teksta bi oznaka bila na 195 < 200
    expect(rasporediOznake([{ x: 100, y: 420 }], { najvisiVrh: 200, tekst, ...mjere })).toEqual([])
  })

  it('oznaku pored teksta ne pomjera', () => {
    const tekst = { lijevo: 0, desno: 400, gore: 400, dolje: 700 }
    expect(rasporediOznake([{ x: 900, y: 500 }], { najvisiVrh: 200, tekst, ...mjere })).toEqual([{ x: 900, y: 500 }])
  })
})
