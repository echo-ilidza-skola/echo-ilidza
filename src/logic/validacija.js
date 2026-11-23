// Provjera podataka iz obrasca za prijavu. Vraća objekat s porukama grešaka po poljima;
// prazan objekat znači da je sve ispravno.

import { MAX_NASLOV, MAX_OPIS, kategorijaPoKljucu } from '../data/konstante.js'
import { jeUOkviruIlidze } from './lokacija.js'
import { prevedi } from '../jezik/prevodi.js'

// Poruke su u rječniku (validacija.…); zadani jezik je bosanski.

export function provjeriOsnovno({ naslov, opis, kategorija }, jezik = 'bs') {
  const t = (kljuc, parametri) => prevedi(jezik, kljuc, parametri)
  const greske = {}
  const n = (naslov || '').trim()
  const o = (opis || '').trim()

  if (!n) greske.naslov = t('validacija.naslovObavezan')
  else if (n.length > MAX_NASLOV) greske.naslov = t('validacija.naslovDug', { max: MAX_NASLOV })

  if (!o) greske.opis = t('validacija.opisObavezan')
  else if (o.length > MAX_OPIS) greske.opis = t('validacija.opisDug', { max: MAX_OPIS })

  if (!kategorijaPoKljucu(kategorija)) greske.kategorija = t('validacija.kategorija')

  return greske
}

export function provjeriLokaciju(lokacija, jezik = 'bs') {
  const greske = {}
  if (!lokacija || !Number.isFinite(lokacija.lat) || !Number.isFinite(lokacija.lng)) {
    greske.lokacija = prevedi(jezik, 'validacija.lokacija')
  }
  return greske
}

// Upozorenje (ne greška): lokacija izvan približnog okvira Ilidže se NE blokira.
export function upozorenjeLokacije(lokacija, jezik = 'bs') {
  if (!lokacija) return null
  if (jeUOkviruIlidze(lokacija)) return null
  return prevedi(jezik, 'validacija.izvanIlidze')
}

export function imaGresaka(greske) {
  return Object.keys(greske).length > 0
}
