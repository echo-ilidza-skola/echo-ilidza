// Pravi Leaflet ikonu za prijavu na mapi.
// Boja = kategorija, oblik = status, broj u uglu = broj prijavitelja (ako ih je više od 1).
// Ikona je obični HTML, a izgled je u global.css (klase .oznaka...).

import L from 'leaflet'
import { kategorijaPoKljucu, nazivStatusa, OBLICI_STATUSA } from '../../data/konstante.js'
import { escapeHtml } from '../../logic/tekst.js'

// Klasa koja određuje oblik oznake za dati status.
export function klasaOblika(status) {
  const oblik = OBLICI_STATUSA[status] ? OBLICI_STATUSA[status].oblik : 'krug'
  return `oznaka oznaka--${oblik}`
}

// Tekst koji čitač ekrana pročita kad oznaka dobije fokus.
export function opisOznake(prijava) {
  const kategorija = kategorijaPoKljucu(prijava.kategorija)
  let opis = `${prijava.naslov}. ${kategorija ? kategorija.naziv : ''}. Status: ${nazivStatusa(prijava.status)}.`
  if (prijava.brojPrijavitelja > 1) opis += ` Broj prijavitelja: ${prijava.brojPrijavitelja}.`
  return opis
}

export function napraviIkonu(prijava) {
  const kategorija = kategorijaPoKljucu(prijava.kategorija)
  const boja = kategorija ? kategorija.boja : '#5E6B66'
  const broj =
    prijava.brojPrijavitelja > 1
      ? `<span class="oznaka-broj" aria-hidden="true">${Number(prijava.brojPrijavitelja)}</span>`
      : ''

  // Naslov je tekst koji je unio korisnik, pa ga OBAVEZNO pretvaramo u bezopasan tekst.
  const html =
    `<span class="${klasaOblika(prijava.status)}" style="background:${boja}" aria-hidden="true"></span>` +
    broj +
    `<span class="vizuelno-skriveno">${escapeHtml(opisOznake(prijava))}</span>`

  return L.divIcon({
    className: 'oznaka-omotac',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -16],
  })
}
