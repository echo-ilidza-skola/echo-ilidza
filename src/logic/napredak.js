// Koraci trake napretka statusa (kao "eho": građanin vidi kako mu status odgovara).
// Čista funkcija: iz prijave pravi listu koraka sa stanjem i datumom.

import { TOK_STATUSA, nazivStatusa } from '../data/konstante.js'
import { prevedi } from '../jezik/prevodi.js'

// Kraći nazivi za uski ekran (rječnik: statusiKratko); "(simulacija)" ostaje uz Proslijeđeno.
function kratkiNaziv(status, jezik) {
  return prevedi(jezik, `statusiKratko.${status}`)
}

// POSLJEDNJI ulazak u dati status iz historije (ili null).
function zadnjiUlazak(historija, status) {
  const koraci = (historija || []).filter((k) => k.status === status)
  return koraci.length ? koraci[koraci.length - 1] : null
}

// Datum posljednjeg ulaska u dati status (ili null).
function datumStatusa(historija, status) {
  return zadnjiUlazak(historija, status)?.datum ?? null
}

// Napomena uz posljednji ulazak u dati status (ili null).
function napomenaStatusa(historija, status) {
  return zadnjiUlazak(historija, status)?.napomena || null
}

// Vraća [{ status, naziv, punNaziv, stanje, datum, napomena }]
//   stanje: 'gotov' (prošli korak), 'trenutni', 'buduci' ili 'odbijen'
// Odbijena prijava ima samo dva koraka: Na čekanju → Odbijeno.
export function koraciNapretka(prijava, jezik = 'bs') {
  const historija = prijava.historijaStatusa || []

  if (prijava.status === 'ODBIJENO') {
    return [
      { status: 'NA_CEKANJU', stanje: 'gotov' },
      { status: 'ODBIJENO', stanje: 'odbijen' },
    ].map((k) => ({
      ...k,
      naziv: kratkiNaziv(k.status, jezik),
      punNaziv: nazivStatusa(k.status, jezik),
      datum: datumStatusa(historija, k.status),
      napomena: napomenaStatusa(historija, k.status),
    }))
  }

  const trenutni = TOK_STATUSA.indexOf(prijava.status)
  return TOK_STATUSA.map((status, i) => {
    const stanje = i < trenutni ? 'gotov' : i === trenutni ? 'trenutni' : 'buduci'
    return {
      status,
      naziv: kratkiNaziv(status, jezik),
      punNaziv: nazivStatusa(status, jezik),
      stanje,
      // Budući koraci nemaju datum (čak i ako je status nekad ranije bio postavljen pa vraćen).
      datum: stanje === 'buduci' ? null : datumStatusa(historija, status),
      napomena: stanje === 'buduci' ? null : napomenaStatusa(historija, status),
    }
  })
}

// Koliko je posto puta pređeno (za liniju napretka): od 0 do 100.
export function procenatNapretka(prijava) {
  if (prijava.status === 'ODBIJENO') return 100
  const i = TOK_STATUSA.indexOf(prijava.status)
  if (i < 0) return 0
  return Math.round((i / (TOK_STATUSA.length - 1)) * 100)
}
