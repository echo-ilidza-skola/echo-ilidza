// Pravi Leaflet ikonu za prijavu na mapi.
// Sve oznake imaju ISTI oblik (pin/kapljica) obojen bojom kategorije.
//   - status: mala značka gore desno (Zaprimljeno bez značke, U obradi sat, Proslijeđeno strelica, Riješeno kvačica);
//   - broj prijavitelja (ako ih je više od 1): broj u bijelom krugu u sredini pina.
// Ikona je obični HTML/SVG, a izgled je u global.css (klase .pin...).

import L from 'leaflet'
import { kategorijaPoKljucu, nazivStatusa, ZNACKE_STATUSA } from '../../data/konstante.js'
import { escapeHtml } from '../../logic/tekst.js'

// Oblik pina u polju 32 × 42 (vrh pina je dolje u sredini, tačka 16, 41).
const OBLIK_PINA = 'M16 1.5C7.9 1.5 1.5 7.9 1.5 15.8c0 10.3 12.6 23.4 13.5 24.3a1.4 1.4 0 0 0 2 0c.9-.9 13.5-14 13.5-24.3C30.5 7.9 24.1 1.5 16 1.5z'

// Tekst koji čitač ekrana pročita kad oznaka dobije fokus.
export function opisOznake(prijava) {
  const kategorija = kategorijaPoKljucu(prijava.kategorija)
  let opis = `${prijava.naslov}. ${kategorija ? kategorija.naziv : ''}. Status: ${nazivStatusa(prijava.status)}.`
  if (prijava.brojPrijavitelja > 1) opis += ` Broj prijavitelja: ${prijava.brojPrijavitelja}.`
  return opis
}

// SVG značke statusa (prazan tekst za Zaprimljeno). Koristi se i u legendi.
export function htmlZnackeStatusa(status) {
  const znacka = ZNACKE_STATUSA[status]
  if (!znacka) return ''
  return (
    '<span class="pin-znacka" aria-hidden="true">' +
    `<svg viewBox="0 0 16 16" width="12" height="12"><path d="${znacka.putanja}"/></svg>` +
    '</span>'
  )
}

// HTML samog pina: oblik u boji kategorije, sredina (tačka ili broj) i značka statusa.
export function htmlPina(boja, status, brojPrijavitelja = 1) {
  const sredina =
    brojPrijavitelja > 1
      ? `<text x="16" y="19.6" text-anchor="middle" class="pin-broj">${Number(brojPrijavitelja)}</text>`
      : ''
  return (
    `<span class="pin" style="--boja-pina:${boja}">` +
    '<svg class="pin-oblik" viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">' +
    `<path d="${OBLIK_PINA}"/>` +
    `<circle cx="16" cy="15.8" r="${brojPrijavitelja > 1 ? 7.5 : 4.5}" class="pin-sredina"/>` +
    sredina +
    '</svg>' +
    htmlZnackeStatusa(status) +
    '</span>'
  )
}

export function napraviIkonu(prijava) {
  const kategorija = kategorijaPoKljucu(prijava.kategorija)
  const boja = kategorija ? kategorija.boja : 'var(--tekst-prigusen)'
  // Naslov je tekst koji je unio korisnik, pa ga OBAVEZNO pretvaramo u bezopasan tekst.
  const html =
    htmlPina(boja, prijava.status, prijava.brojPrijavitelja) +
    `<span class="vizuelno-skriveno">${escapeHtml(opisOznake(prijava))}</span>`

  return L.divIcon({
    className: 'oznaka-omotac',
    html,
    iconSize: [32, 42],
    iconAnchor: [16, 41], // vrh pina pokazuje tačnu lokaciju
    popupAnchor: [0, -38],
  })
}
