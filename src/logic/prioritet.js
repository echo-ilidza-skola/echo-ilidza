// Orijentacioni prijedlog prioriteta (pravila, ne AI). NIJE procjena stvarne opasnosti.
//
// Bodovi:
//   riječi opasnosti ("opasno", "povrijed", "otvoren šaht", "pao", "ozlijed")  +3 (jednom, bez obzira na broj riječi)
//   spominjanje škole, vrtića ili igrališta                                     +2 (jednom)
//   svaka povezana prijava                                                       +1
// Ukupno: 0–2 nizak, 3–4 srednji, 5 i više visok.

import { pronadjiKljucneRijeci } from './tekst.js'

export const RIJECI_OPASNOSTI = ['opasno', 'povrijed', 'otvoren šaht', 'pao', 'ozlijed']
export const RIJECI_DJECA = ['škola', 'vrtić', 'igralište']

export const BODOVI_OPASNOST = 3
export const BODOVI_DJECA = 2
export const BODOVI_PO_POVEZANOJ = 1

export function prioritetIzBodova(bodovi) {
  if (bodovi >= 5) return 'visok'
  if (bodovi >= 3) return 'srednji'
  return 'nizak'
}

// Vraća { prioritet, bodovi, razlozi: [{ pravilo, bodovi }] }.
// Razlozi su lista pravila koja su se aktivirala; prikazuju se administratoru.
export function predloziPrioritet(naslov, opis, brojPovezanih = 0) {
  const tekst = `${naslov || ''} ${opis || ''}`
  const razlozi = []

  const opasnost = pronadjiKljucneRijeci(tekst, RIJECI_OPASNOSTI)
  if (opasnost.length > 0) {
    razlozi.push({
      pravilo: `Riječi opasnosti: ${opasnost.map((p) => `„${p.rijec}“`).join(', ')}`,
      bodovi: BODOVI_OPASNOST,
    })
  }

  const djeca = pronadjiKljucneRijeci(tekst, RIJECI_DJECA)
  if (djeca.length > 0) {
    razlozi.push({
      pravilo: `Spominje se škola, vrtić ili igralište: ${djeca.map((p) => `„${p.rijec}“`).join(', ')}`,
      bodovi: BODOVI_DJECA,
    })
  }

  const povezane = Math.max(0, Math.floor(Number(brojPovezanih) || 0))
  if (povezane > 0) {
    razlozi.push({
      pravilo: `Povezane prijave: ${povezane}`,
      bodovi: povezane * BODOVI_PO_POVEZANOJ,
    })
  }

  const bodovi = razlozi.reduce((zbir, r) => zbir + r.bodovi, 0)
  return { prioritet: prioritetIzBodova(bodovi), bodovi, razlozi }
}
