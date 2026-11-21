// Statistika prijava. Funkcije primaju listu prijava i ne mijenjaju je.
// Pozivalac bira listu: javne prijave za Početnu, sve prijave za administraciju.

import { KATEGORIJE, STATUSI, NASELJA } from '../data/konstante.js'

const DAN_MS = 24 * 60 * 60 * 1000

function prebroji(prijave, polje, vrijednost) {
  return prijave.filter((p) => p[polje] === vrijednost).length
}

// [{ kljuc, naziv, boja, broj }] za SVE kategorije (i one s 0 prijava).
export function brojPoKategoriji(prijave) {
  return KATEGORIJE.map((k) => ({
    kljuc: k.kljuc,
    naziv: k.naziv,
    boja: k.boja,
    broj: prebroji(prijave, 'kategorija', k.kljuc),
  }))
}

// [{ kljuc, naziv, broj }] za sve statuse.
export function brojPoStatusu(prijave) {
  return Object.entries(STATUSI).map(([kljuc, s]) => ({
    kljuc,
    naziv: s.naziv,
    broj: prebroji(prijave, 'status', kljuc),
  }))
}

// [{ naziv, broj }] za sva naselja; prijave bez poznatog naselja idu pod "Nepoznato".
export function brojPoNaselju(prijave) {
  const rezultat = NASELJA.map((n) => ({ naziv: n.naziv, broj: prebroji(prijave, 'naselje', n.naziv) }))
  const poznata = NASELJA.map((n) => n.naziv)
  const nepoznato = prijave.filter((p) => !poznata.includes(p.naselje)).length
  if (nepoznato > 0) rezultat.push({ naziv: 'Nepoznato', broj: nepoznato })
  return rezultat
}

// Datum kada je prijava (posljednji put) dobila status RIJESENO, ili null.
export function datumRjesavanja(prijava) {
  const koraci = (prijava.historijaStatusa || []).filter((k) => k.status === 'RIJESENO')
  return koraci.length > 0 ? koraci[koraci.length - 1].datum : null
}

// Prosječan broj dana od prijave do statusa "Riješeno".
// Računaju se samo prijave koje su TRENUTNO riješene. Ako takvih nema, vraća null.
export function prosjecnoVrijemeRjesavanjaDana(prijave) {
  const trajanja = []
  for (const p of prijave) {
    if (p.status !== 'RIJESENO') continue
    const kraj = datumRjesavanja(p)
    if (!kraj) continue
    const dana = (new Date(kraj).getTime() - new Date(p.datumPrijave).getTime()) / DAN_MS
    if (Number.isFinite(dana) && dana >= 0) trajanja.push(dana)
  }
  if (trajanja.length === 0) return null
  return trajanja.reduce((zbir, d) => zbir + d, 0) / trajanja.length
}

// Osnovni brojevi za Početnu.
// "uObradi" broji statuse U_OBRADI i PROSLIJEDJENO (prijave na kojima se radi).
export function osnovnaStatistika(prijave) {
  return {
    ukupno: prijave.length,
    rijeseno: prebroji(prijave, 'status', 'RIJESENO'),
    uObradi: prijave.filter((p) => p.status === 'U_OBRADI' || p.status === 'PROSLIJEDJENO').length,
  }
}
