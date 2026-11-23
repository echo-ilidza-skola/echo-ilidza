// Status kao EHO: koliko lukova je "upaljeno" za svaki status i koliko lukova crtamo
// oko oznake na mapi za broj prijavitelja. Čista logika, bez React koda.

import { nazivStatusa } from '../data/konstante.js'

// Najviše lukova (kao u logu): Zaprimljeno 1, U obradi 2, Proslijeđeno 3, Riješeno 4.
export const BROJ_LUKOVA = 4

const KORAK_STATUSA = {
  NA_CEKANJU: 0,
  ZAPRIMLJENO: 1,
  U_OBRADI: 2,
  PROSLIJEDJENO: 3,
  RIJESENO: 4,
}

// Vraća { upaljeno, naCekanju, odbijeno, rijeseno }:
//   upaljeno – koliko lukova je upaljeno (0–4); na čekanju i odbijeno nemaju lukove.
export function ehoZaStatus(status) {
  return {
    upaljeno: KORAK_STATUSA[status] ?? 0,
    naCekanju: status === 'NA_CEKANJU',
    odbijeno: status === 'ODBIJENO',
    rijeseno: status === 'RIJESENO',
  }
}

// Tekst za čitač ekrana, npr. "Status: U obradi, korak 2 od 4".
export function opisEha(status) {
  const naziv = nazivStatusa(status)
  if (status === 'NA_CEKANJU') return `Status: ${naziv}, još nije zaprimljeno`
  if (status === 'ODBIJENO') return `Status: ${naziv}`
  const { upaljeno } = ehoZaStatus(status)
  return `Status: ${naziv}, korak ${upaljeno} od ${BROJ_LUKOVA}`
}

// Koliko lukova eha crtamo oko oznake na mapi, prema broju prijavitelja istog problema:
// 1 prijavitelj: 0, 2–3: 1 luk, 4–6: 2 luka, 7 i više: 3 luka.
export function lukoviZaPrijavitelje(brojPrijavitelja) {
  const n = Number(brojPrijavitelja) || 0
  if (n >= 7) return 3
  if (n >= 4) return 2
  if (n >= 2) return 1
  return 0
}
