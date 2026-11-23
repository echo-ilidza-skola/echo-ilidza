// Poruke kada GPS (određivanje lokacije) nije dostupan (tekstovi su u rječniku, ključevi gps.…).
// Ručni odabir lokacije na mapi UVIJEK radi, pa svaka poruka to i kaže.

import { prevedi } from '../jezik/prevodi.js'

// Brojevi grešaka koje vraća preglednik (GeolocationPositionError).
export const GPS_ODBIJENO = 1
export const GPS_NEDOSTUPNO = 2
export const GPS_ISTEKLO_VRIJEME = 3

// Dodatak na kraju poruke: na obrascu kako ručno odabrati lokaciju, a na stranici Mapa da se mapa
// i dalje može pomjerati (tamo se lokacija samo prikazuje, ne bira).
export const DODATAK_ZA_MAPU = 'zaMapu'
const RUCNO = 'rucno'

// Prije traženja lokacije: da li je GPS uopšte moguć u ovom pregledniku?
// Vraća razlog ('nesigurno' ili 'nepodrzano') ili null ako se može pokušati.
export function razlogNedostupnostiGps({ sigurnaAdresa, podrzano }) {
  if (!sigurnaAdresa) return 'nesigurno'
  if (!podrzano) return 'nepodrzano'
  return null
}

// Ključ poruke za svaki razlog.
const KLJUC_RAZLOGA = {
  nesigurno: 'gps.nesigurno',
  nepodrzano: 'gps.nepodrzano',
  [GPS_ODBIJENO]: 'gps.odbijeno',
  [GPS_NEDOSTUPNO]: 'gps.nedostupno',
  [GPS_ISTEKLO_VRIJEME]: 'gps.isteklo',
}

// dodatak: RUCNO (obrazac) ili DODATAK_ZA_MAPU (stranica Mapa); jezik: 'bs' (zadano) ili 'en'.
export function porukaGps(razlog, dodatak = RUCNO, jezik = 'bs') {
  const kljuc = KLJUC_RAZLOGA[razlog] || 'gps.opste'
  return prevedi(jezik, kljuc) + prevedi(jezik, `gps.${dodatak}`)
}
