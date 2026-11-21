// Pravi novu prijavu prema modelu podataka (čista funkcija, bez spremanja).

import { OPCINA } from '../data/konstante.js'
import { predloziKategoriju } from './prijedlogKategorije.js'
import { predloziPrioritet } from './prioritet.js'
import { najblizeNaselje } from './lokacija.js'

// Jedinstveni id, npr. "p-mi3k2x9a-4f7qz".
export function noviId(sada = new Date(), slucajno = Math.random, prefiks = 'p') {
  return `${prefiks}-${sada.getTime().toString(36)}-${slucajno().toString(36).slice(2, 7)}`
}

// unos: { naslov, opis, kategorija, lat, lng, fotografijaId?, glavnaPrijavaId? }
export function napraviNovuPrijavu(unos, { id, autorId, sada = new Date() }) {
  const naslov = unos.naslov.trim()
  const opis = unos.opis.trim()
  const datum = sada.toISOString()

  return {
    id,
    opcina: OPCINA,
    naslov,
    opis,
    kategorija: unos.kategorija,
    // Čuvamo i prijedlog pravila, da administrator vidi šta su pravila predložila.
    predlozenaKategorija: predloziKategoriju(naslov, opis).kategorija,
    predlozeniPrioritet: predloziPrioritet(naslov, opis, 0).prioritet,
    potvrdjeniPrioritet: null,
    naselje: najblizeNaselje(unos),
    lat: unos.lat,
    lng: unos.lng,
    fotografijaId: unos.fotografijaId || null,
    fotografijaSkrivena: false,
    datumPrijave: datum,
    status: 'NA_CEKANJU',
    historijaStatusa: [{ status: 'NA_CEKANJU', datum }],
    razlogOdbijanja: null,
    internaNapomena: '',
    glavnaPrijavaId: unos.glavnaPrijavaId || null,
    brojPrijavitelja: 1,
    autorId,
    testniPodatak: true,
  }
}

// Kad građanin potvrdi "isti problem": glavna prijava dobija još jednog prijavitelja,
// a predloženi prioritet se ponovo računa (svaka povezana prijava +1).
export function povecajBrojPrijavitelja(glavna) {
  const broj = (glavna.brojPrijavitelja || 1) + 1
  return {
    ...glavna,
    brojPrijavitelja: broj,
    predlozeniPrioritet: predloziPrioritet(glavna.naslov, glavna.opis, broj - 1).prioritet,
  }
}
