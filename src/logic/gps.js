// Poruke kada GPS (određivanje lokacije) nije dostupan.
// Ručni odabir lokacije na mapi UVIJEK radi, pa svaka poruka to i kaže.

// Brojevi grešaka koje vraća preglednik (GeolocationPositionError).
export const GPS_ODBIJENO = 1
export const GPS_NEDOSTUPNO = 2
export const GPS_ISTEKLO_VRIJEME = 3

const RUCNO = ' Lokaciju odaberite klikom na mapu ili izborom naselja.'

// Prije traženja lokacije: da li je GPS uopšte moguć u ovom pregledniku?
// Vraća razlog ('nesigurno' ili 'nepodrzano') ili null ako se može pokušati.
export function razlogNedostupnostiGps({ sigurnaAdresa, podrzano }) {
  if (!sigurnaAdresa) return 'nesigurno'
  if (!podrzano) return 'nepodrzano'
  return null
}

export function porukaGps(razlog) {
  switch (razlog) {
    case 'nesigurno':
      return (
        'GPS radi samo na sigurnoj adresi (https:// ili localhost). Ova stranica je otvorena preko obične ' +
        'http adrese (npr. http://192.168…), pa preglednik ne dozvoljava lokaciju. To nije greška aplikacije.' +
        RUCNO
      )
    case 'nepodrzano':
      return 'Ovaj preglednik ne podržava određivanje lokacije.' + RUCNO
    case GPS_ODBIJENO:
      return (
        'Pristup lokaciji nije dozvoljen. Dozvolu možete promijeniti u postavkama preglednika.' + RUCNO
      )
    case GPS_NEDOSTUPNO:
      return 'Lokaciju trenutno nije moguće odrediti (npr. GPS je isključen ili nema signala).' + RUCNO
    case GPS_ISTEKLO_VRIJEME:
      return 'Određivanje lokacije traje predugo.' + RUCNO
    default:
      return 'Lokaciju nije moguće odrediti.' + RUCNO
  }
}
