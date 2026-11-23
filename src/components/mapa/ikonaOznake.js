// Pravi Leaflet ikonu za prijavu na mapi.
// Sve oznake imaju ISTI oblik (pin/kapljica) obojen bojom kategorije.
//   - status: mala značka gore desno (Zaprimljeno bez značke, U obradi sat, Proslijeđeno strelica, Riješeno kvačica);
//   - više prijavitelja istog problema: mirni lukovi eha lijevo od pina (2–3: 1 luk, 4–6: 2, 7+: 3);
//     tačan broj piše u sredini pina samo kad je oznaka odabrana (i u sažetku).
// Ikona je obični HTML/SVG, a izgled je u global.css (klase .pin...).

import L from 'leaflet'
import { kategorijaPoKljucu, nazivStatusa, nazivKategorije, ZNACKE_STATUSA } from '../../data/konstante.js'
import { prevedi } from '../../jezik/prevodi.js'
import { escapeHtml } from '../../logic/tekst.js'
import { lukoviZaPrijavitelje } from '../../logic/ehoStatus.js'

// Oblik pina u polju 32 × 42 (vrh pina je dolje u sredini, tačka 16, 41).
const OBLIK_PINA = 'M16 1.5C7.9 1.5 1.5 7.9 1.5 15.8c0 10.3 12.6 23.4 13.5 24.3a1.4 1.4 0 0 0 2 0c.9-.9 13.5-14 13.5-24.3C30.5 7.9 24.1 1.5 16 1.5z'

// Tekst koji čitač ekrana pročita kad oznaka dobije fokus (na izabranom jeziku).
export function opisOznake(prijava, jezik = 'bs') {
  let opis = prevedi(jezik, 'oznaka.opis', {
    naslov: prijava.naslov,
    kategorija: nazivKategorije(prijava.kategorija, jezik),
    status: nazivStatusa(prijava.status, jezik),
  })
  if (prijava.brojPrijavitelja > 1) opis += prevedi(jezik, 'oznaka.prijavitelja', { broj: prijava.brojPrijavitelja })
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

// Lukovi eha LIJEVO od glave pina (središte glave je 16, 15.8); desno je značka statusa.
const POLUPRECNICI_LUKOVA = [20, 25.5, 31]
const UGAO_LUKA = 0.62 // pola ugla luka, u radijanima (oko 35°)
function htmlLukova(broj) {
  let html = ''
  for (const r of POLUPRECNICI_LUKOVA.slice(0, broj)) {
    const x = (16 - r * Math.cos(UGAO_LUKA)).toFixed(1)
    const dy = r * Math.sin(UGAO_LUKA)
    const d = `M${x} ${(15.8 - dy).toFixed(1)}A${r} ${r} 0 0 0 ${x} ${(15.8 + dy).toFixed(1)}`
    // Prvo bijela podloga (da se luk vidi na svakoj mapi), pa luk u boji kategorije.
    html += `<path d="${d}" class="pin-luk-podloga"/><path d="${d}" class="pin-luk"/>`
  }
  return html
}

// HTML samog pina: lukovi eha (za više prijavitelja), oblik u boji kategorije, sredina i značka statusa.
export function htmlPina(boja, status, brojPrijavitelja = 1) {
  const visePrijavitelja = brojPrijavitelja > 1
  // Broj se vidi samo na odabranoj oznaci (vidi .oznaka-omotac--odabrana u global.css).
  const broj = visePrijavitelja
    ? `<circle cx="16" cy="15.8" r="7.5" class="pin-sredina pin-sredina--broj"/>` +
      `<text x="16" y="19.6" text-anchor="middle" class="pin-broj">${Number(brojPrijavitelja)}</text>`
    : ''
  return (
    `<span class="pin" style="--boja-pina:${boja}">` +
    '<svg class="pin-oblik" viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">' +
    htmlLukova(lukoviZaPrijavitelje(brojPrijavitelja)) +
    `<path d="${OBLIK_PINA}" class="pin-tijelo"/>` +
    `<circle cx="16" cy="15.8" r="4.5" class="pin-sredina"/>` +
    broj +
    '</svg>' +
    htmlZnackeStatusa(status) +
    '</span>'
  )
}

export function napraviIkonu(prijava, jezik = 'bs') {
  const kategorija = kategorijaPoKljucu(prijava.kategorija)
  const boja = kategorija ? kategorija.boja : 'var(--tekst-prigusen)'
  // Naslov je tekst koji je unio korisnik, pa ga OBAVEZNO pretvaramo u bezopasan tekst.
  const html =
    htmlPina(boja, prijava.status, prijava.brojPrijavitelja) +
    `<span class="vizuelno-skriveno">${escapeHtml(opisOznake(prijava, jezik))}</span>`

  return L.divIcon({
    className: 'oznaka-omotac',
    html,
    iconSize: [32, 42],
    iconAnchor: [16, 41], // vrh pina pokazuje tačnu lokaciju
    popupAnchor: [0, -38],
  })
}
