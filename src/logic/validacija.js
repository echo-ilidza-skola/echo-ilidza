// Provjera podataka iz obrasca za prijavu. Vraća objekat s porukama grešaka po poljima;
// prazan objekat znači da je sve ispravno.

import { MAX_NASLOV, MAX_OPIS, kategorijaPoKljucu } from '../data/konstante.js'
import { jeUOkviruIlidze } from './lokacija.js'

export function provjeriOsnovno({ naslov, opis, kategorija }) {
  const greske = {}
  const n = (naslov || '').trim()
  const o = (opis || '').trim()

  if (!n) greske.naslov = 'Naslov je obavezan.'
  else if (n.length > MAX_NASLOV) greske.naslov = `Naslov može imati najviše ${MAX_NASLOV} znakova.`

  if (!o) greske.opis = 'Opis je obavezan.'
  else if (o.length > MAX_OPIS) greske.opis = `Opis može imati najviše ${MAX_OPIS} znakova.`

  if (!kategorijaPoKljucu(kategorija)) greske.kategorija = 'Odaberite kategoriju.'

  return greske
}

export function provjeriLokaciju(lokacija) {
  const greske = {}
  if (!lokacija || !Number.isFinite(lokacija.lat) || !Number.isFinite(lokacija.lng)) {
    greske.lokacija = 'Odaberite lokaciju: kliknite na mapu, koristite GPS ili odaberite naselje.'
  }
  return greske
}

// Upozorenje (ne greška): lokacija izvan približnog okvira Ilidže se NE blokira.
export function upozorenjeLokacije(lokacija) {
  if (!lokacija) return null
  if (jeUOkviruIlidze(lokacija)) return null
  return 'Odabrana lokacija je izvan približnog područja Ilidže. Provjerite da li je tačna – prijavu i dalje možete poslati.'
}

export function imaGresaka(greske) {
  return Object.keys(greske).length > 0
}
