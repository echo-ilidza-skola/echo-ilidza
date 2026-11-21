// Pronalaženje MOGUĆIH duplikata. Sistem duplikat samo PREDLAŽE – nikad ne povezuje automatski.
//
// Prijava je mogući duplikat ako:
//   - ima istu kategoriju,
//   - status joj nije ODBIJENO ni RIJESENO,
//   - udaljena je MANJE od praga (početno 50 m; tačno 50 m NIJE duplikat).
//
// Važno: pozivalac odlučuje koje prijave šalje. Za građanina treba poslati samo
// JAVNE prijave, da se ne bi otkrile prijave koje administrator još nije odobrio.

import { PRAG_DUPLIKATA_M } from '../data/konstante.js'
import { udaljenostM } from './udaljenost.js'

const ZAVRSENI_STATUSI = ['ODBIJENO', 'RIJESENO']

// Udaljenost zaokružujemo na milimetar, da sitne greške u računanju
// (npr. 49,9999999 m) ne promijene rezultat na samoj granici.
function zaokruziNaMilimetar(metri) {
  return Math.round(metri * 1000) / 1000
}

// nova: { kategorija, lat, lng }
// prijave: lista postojećih prijava
// opcije.izuzmiId: id prijave koju ne treba porediti samu sa sobom
// Vraća [{ prijavaId, udaljenostM }] sortirano od najbliže.
// Ako je pronađena povezana prijava, predlaže se njena GLAVNA prijava.
export function pronadjiMoguceDuplikate(nova, prijave, opcije = {}) {
  const prag = opcije.prag ?? PRAG_DUPLIKATA_M
  if (!nova || !nova.kategorija || !Number.isFinite(nova.lat) || !Number.isFinite(nova.lng)) {
    return []
  }

  const najblizePoGlavnoj = new Map()

  for (const p of prijave || []) {
    if (p.id === opcije.izuzmiId) continue
    if (p.kategorija !== nova.kategorija) continue
    if (ZAVRSENI_STATUSI.includes(p.status)) continue

    const d = zaokruziNaMilimetar(udaljenostM(nova, p))
    if (d >= prag) continue

    const glavnaId = p.glavnaPrijavaId || p.id
    if (glavnaId === opcije.izuzmiId) continue
    const dosadasnja = najblizePoGlavnoj.get(glavnaId)
    if (dosadasnja === undefined || d < dosadasnja) {
      najblizePoGlavnoj.set(glavnaId, d)
    }
  }

  return [...najblizePoGlavnoj.entries()]
    .map(([prijavaId, d]) => ({ prijavaId, udaljenostM: d }))
    .sort((a, b) => a.udaljenostM - b.udaljenostM)
}
