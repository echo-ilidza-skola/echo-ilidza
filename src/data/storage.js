// JEDINO mjesto u aplikaciji koje čita i piše podatke.
// Komponente nikad ne diraju localStorage direktno – uvijek pozivaju funkcije odavde.
// U kasnijim fazama ovaj modul se može zamijeniti pozivima na server.
//
// Fotografije (IndexedDB preko idb-keyval) dodaju se ovdje u etapi 4.
// Funkcije za izmjenu prijava (status, napomene, povezivanje) dodaju se u etapama 4 i 5.

import { napraviTestnePodatke } from './testniPodaci.js'
import { uJavniPrikaz } from '../logic/javniPrikaz.js'
import { ULOGE } from './konstante.js'

const KLJUC_PRIJAVE = 'echo.prijave.v1'
const KLJUC_ULOGA = 'echo.uloga'

// Ime događaja koji javlja ekranima da su se podaci promijenili.
export const DOGADJAJ_PROMJENE = 'echo:promjena'

// ---------- pomoćne funkcije ----------

function citajJson(kljuc) {
  try {
    const tekst = localStorage.getItem(kljuc)
    return tekst === null ? null : JSON.parse(tekst)
  } catch {
    // Oštećen JSON ili blokiran localStorage: ponašamo se kao da podataka nema.
    return null
  }
}

function pisiJson(kljuc, vrijednost) {
  try {
    localStorage.setItem(kljuc, JSON.stringify(vrijednost))
    return true
  } catch {
    return false
  }
}

function javiPromjenu() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(DOGADJAJ_PROMJENE))
  }
}

function sacuvajPrijave(prijave) {
  const uspjeh = pisiJson(KLJUC_PRIJAVE, prijave)
  javiPromjenu()
  return uspjeh
}

// ---------- pokretanje ----------

// Poziva se jednom pri pokretanju aplikacije.
// Ako podataka nema (prvo pokretanje ili obrisani podaci preglednika)
// ili su oštećeni, učitavaju se testni podaci. Zato se aplikacija ne ruši.
export function inicijalizuj() {
  const prijave = citajJson(KLJUC_PRIJAVE)
  if (Array.isArray(prijave)) {
    return { ucitaniTestniPodaci: false }
  }
  sacuvajPrijave(napraviTestnePodatke())
  return { ucitaniTestniPodaci: true }
}

// Briše sve prijave i ponovo učitava 28 testnih prijava.
// Potvrdu od korisnika traži ekran koji poziva ovu funkciju.
export function vratiTestnePodatke() {
  return sacuvajPrijave(napraviTestnePodatke())
}

// ---------- čitanje (puni zapisi – samo za administraciju i autora) ----------

export function svePrijave() {
  const prijave = citajJson(KLJUC_PRIJAVE)
  return Array.isArray(prijave) ? prijave : []
}

export function dohvatiPrijavu(id) {
  return svePrijave().find((p) => p.id === id) || null
}

export function prijaveAutora(autorId) {
  return svePrijave().filter((p) => p.autorId === autorId)
}

// ---------- čitanje (javni prikaz) ----------

// Samo odobrene prijave i samo javna polja.
export function javnePrijave() {
  return svePrijave().map(uJavniPrikaz).filter(Boolean)
}

// Javna verzija jedne prijave ili null ako ne postoji ili nije javna.
export function javnaPrijava(id) {
  return uJavniPrikaz(dohvatiPrijavu(id))
}

// ---------- demo uloga ----------

export function ucitajUlogu() {
  const uloga = citajJson(KLJUC_ULOGA)
  return ULOGE[uloga] ? uloga : 'gost'
}

export function sacuvajUlogu(uloga) {
  if (!ULOGE[uloga]) return false
  return pisiJson(KLJUC_ULOGA, uloga)
}
