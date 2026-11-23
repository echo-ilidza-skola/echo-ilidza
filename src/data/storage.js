// JEDINO mjesto u aplikaciji koje čita i piše podatke.
// Komponente nikad ne diraju localStorage ni IndexedDB direktno – uvijek pozivaju funkcije odavde.
// U kasnijim fazama ovaj modul se može zamijeniti pozivima na server.
//
//   - prijave, demo uloga i jezik: localStorage
//   - fotografije: IndexedDB (preko biblioteke idb-keyval), jer su prevelike za localStorage
//

import { createStore, get, set, del, clear } from 'idb-keyval'
import { napraviTestnePodatke } from './testniPodaci.js'
import { TESTNE_FOTOGRAFIJE, PREFIKS_TESTNE_FOTOGRAFIJE, dopuniTestneFotografije } from './testneFotografije.js'
import { uJavniPrikaz } from '../logic/javniPrikaz.js'
import { napraviNovuPrijavu, povecajBrojPrijavitelja, noviId } from '../logic/novaPrijava.js'
import {
  promijeniStatus,
  potvrdiKategorijuIPrioritet,
  poveziPrijave,
  razdvojiPrijave,
} from '../logic/administracija.js'
import { ULOGE } from './konstante.js'
import { POCETNI_JEZIK, jeIspravanJezik } from '../jezik/prevodi.js'
import { napraviGresku } from '../jezik/greska.js'

const KLJUC_PRIJAVE = 'echo.prijave.v1'
const KLJUC_ULOGA = 'echo.uloga'
const KLJUC_JEZIK = 'echo.jezik'

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
    // Podaci spremljeni u ranijoj verziji: testnim prijavama dodaj njihove testne fotografije.
    const dopuna = dopuniTestneFotografije(prijave)
    if (dopuna.dopunjeno > 0) sacuvajPrijave(dopuna.prijave)
    return { ucitaniTestniPodaci: false }
  }
  sacuvajPrijave(napraviTestnePodatke())
  // Stare fotografije više ne pripadaju nijednoj prijavi, pa ih brišemo.
  obrisiSveFotografije()
  return { ucitaniTestniPodaci: true }
}

// Briše sve prijave i fotografije i ponovo učitava 28 testnih prijava.
// Potvrdu od korisnika traži ekran koji poziva ovu funkciju.
export function vratiTestnePodatke() {
  const uspjeh = sacuvajPrijave(napraviTestnePodatke())
  obrisiSveFotografije()
  return uspjeh
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

// ---------- nova prijava ----------

// Sprema novu prijavu (status "Na čekanju provjere") i vraća je.
// Ako je građanin potvrdio da je to ISTI problem kao postojeća prijava (unos.glavnaPrijavaId),
// glavna prijava dobija još jednog prijavitelja. Sistem nikad ne povezuje sam.
export function dodajPrijavu(unos, autorId) {
  const prijave = svePrijave()
  const glavna = unos.glavnaPrijavaId ? prijave.find((p) => p.id === unos.glavnaPrijavaId) : null

  const nova = napraviNovuPrijavu(
    { ...unos, glavnaPrijavaId: glavna ? glavna.id : null },
    { id: noviId(), autorId },
  )

  const azurirane = prijave.map((p) => (glavna && p.id === glavna.id ? povecajBrojPrijavitelja(p) : p))
  azurirane.push(nova)

  if (!sacuvajPrijave(azurirane)) {
    throw napraviGresku('greske.prijavaSpremanje')
  }
  return nova
}

// ---------- administracija ----------
// Sve izmjene idu kroz čiste funkcije iz src/logic/administracija.js; ovdje se samo spremaju.

function sacuvajIliGreska(prijave) {
  if (!sacuvajPrijave(prijave)) {
    throw napraviGresku('greske.izmjenaSpremanje')
  }
}

// Mijenja jednu prijavu funkcijom "izmjena" i vraća izmijenjenu prijavu.
function azurirajPrijavu(id, izmjena) {
  const prijave = svePrijave()
  const indeks = prijave.findIndex((p) => p.id === id)
  if (indeks < 0) throw napraviGresku('greske.nemaPrijave')
  const nove = [...prijave]
  nove[indeks] = izmjena(prijave[indeks])
  sacuvajIliGreska(nove)
  return nove[indeks]
}

// Odobravanje: administrator potvrđuje kategoriju i prioritet, a prijava postaje javna (Zaprimljeno).
export function odobriPrijavu(id, { kategorija, prioritet, napomena }) {
  return azurirajPrijavu(id, (p) =>
    promijeniStatus(potvrdiKategorijuIPrioritet(p, kategorija, prioritet), 'ZAPRIMLJENO', {
      napomena: napomena || 'Prijava je provjerena i odobrena.',
    }),
  )
}

// Odbijanje uz obavezan razlog, koji autor vidi u "Mojim prijavama".
export function odbijPrijavu(id, razlog) {
  return azurirajPrijavu(id, (p) => promijeniStatus(p, 'ODBIJENO', { napomena: razlog }))
}

export function promijeniStatusPrijave(id, noviStatus, napomena) {
  return azurirajPrijavu(id, (p) => promijeniStatus(p, noviStatus, { napomena }))
}

export function sacuvajKategorijuIPrioritet(id, kategorija, prioritet) {
  return azurirajPrijavu(id, (p) => potvrdiKategorijuIPrioritet(p, kategorija, prioritet))
}

// Interna napomena je samo za administraciju i NIKAD se ne prikazuje javno.
export function sacuvajInternuNapomenu(id, tekst) {
  return azurirajPrijavu(id, (p) => ({ ...p, internaNapomena: (tekst || '').trim() }))
}

// Sakrivena fotografija se ne prikazuje u javnom prikazu (administrator je i dalje vidi).
export function postaviSakrivenuFotografiju(id, sakrivena) {
  return azurirajPrijavu(id, (p) => ({ ...p, fotografijaSkrivena: Boolean(sakrivena) }))
}

export function poveziPrijavu(id, saId) {
  sacuvajIliGreska(poveziPrijave(svePrijave(), id, saId))
}

export function razdvojiPrijavu(id) {
  sacuvajIliGreska(razdvojiPrijave(svePrijave(), id))
}

// ---------- fotografije (IndexedDB) ----------

// Posebna baza samo za fotografije. Pravi se tek kad zatreba
// (u testovima i starim preglednicima IndexedDB možda ne postoji).
let fotoSpremiste = null
function spremiste() {
  if (!fotoSpremiste) fotoSpremiste = createStore('echo-fotografije', 'fotografije')
  return fotoSpremiste
}

// Sprema fotografiju (Blob) i vraća njen ključ. Kod greške baca grešku s porukom na bosanskom.
export async function sacuvajFotografiju(blob) {
  const id = noviId(new Date(), Math.random, 'foto')
  try {
    await set(id, blob, spremiste())
  } catch {
    throw napraviGresku('greske.fotoSpremanje')
  }
  return id
}

// Vraća Blob fotografije ili null ako je nema (npr. obrisani podaci preglednika).
export async function ucitajFotografiju(id) {
  if (!id) return null
  // Fotografije testnih prijava su u projektu (src/assets), a ne u IndexedDB.
  if (id.startsWith(PREFIKS_TESTNE_FOTOGRAFIJE)) {
    const testna = TESTNE_FOTOGRAFIJE[id.slice(PREFIKS_TESTNE_FOTOGRAFIJE.length)]
    if (!testna) return null
    try {
      const odgovor = await fetch(testna.url)
      return odgovor.ok ? await odgovor.blob() : null
    } catch {
      return null
    }
  }
  try {
    return (await get(id, spremiste())) || null
  } catch {
    return null
  }
}

export async function obrisiFotografiju(id) {
  try {
    await del(id, spremiste())
  } catch {
    // Ako brisanje ne uspije, fotografija samo ostaje u pregledniku; aplikacija nastavlja raditi.
  }
}

export async function obrisiSveFotografije() {
  try {
    await clear(spremiste())
  } catch {
    // IndexedDB nije dostupan: nema ni fotografija za brisanje.
  }
}

// ---------- demo uloga ----------

// Početna demo uloga pri prvom pokretanju (odluka mentorice: Građanin, da se odmah vidi prijava problema).
export const POCETNA_ULOGA = 'gradjanin'

export function ucitajUlogu() {
  const uloga = citajJson(KLJUC_ULOGA)
  return ULOGE[uloga] ? uloga : POCETNA_ULOGA
}

export function sacuvajUlogu(uloga) {
  if (!ULOGE[uloga]) return false
  return pisiJson(KLJUC_ULOGA, uloga)
}

// ---------- jezik interfejsa ----------

export function ucitajJezik() {
  const jezik = citajJson(KLJUC_JEZIK)
  return jeIspravanJezik(jezik) ? jezik : POCETNI_JEZIK
}

export function sacuvajJezik(jezik) {
  if (!jeIspravanJezik(jezik)) return false
  return pisiJson(KLJUC_JEZIK, jezik)
}
