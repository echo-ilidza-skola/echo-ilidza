// Poruke kada GPS (određivanje lokacije) nije dostupan.
// Ručni odabir lokacije na mapi UVIJEK radi, pa svaka poruka to i kaže.

// Brojevi grešaka koje vraća preglednik (GeolocationPositionError).
export const GPS_ODBIJENO = 1
export const GPS_NEDOSTUPNO = 2
export const GPS_ISTEKLO_VRIJEME = 3

const RUCNO = ' Lokaciju odaberite klikom na mapu ili izborom naselja.'
// Dodatak za stranicu Mapa (tamo se lokacija samo prikazuje, ne bira).
export const DODATAK_ZA_MAPU = ' Mapu i dalje možete pomjerati i uvećavati ručno.'

// Prije traženja lokacije: da li je GPS uopšte moguć u ovom pregledniku?
// Vraća razlog ('nesigurno' ili 'nepodrzano') ili null ako se može pokušati.
export function razlogNedostupnostiGps({ sigurnaAdresa, podrzano }) {
  if (!sigurnaAdresa) return 'nesigurno'
  if (!podrzano) return 'nepodrzano'
  return null
}

// dodatak: rečenica na kraju poruke (na obrascu: kako ručno odabrati lokaciju).
export function porukaGps(razlog, dodatak = RUCNO) {
  switch (razlog) {
    case 'nesigurno':
      return (
        'GPS radi samo na sigurnoj adresi (https:// ili localhost). Ova stranica je otvorena preko obične ' +
        'http adrese (npr. http://192.168…), pa preglednik ne dozvoljava lokaciju. To nije greška aplikacije.' +
        dodatak
      )
    case 'nepodrzano':
      return 'Ovaj preglednik ne podržava određivanje lokacije.' + dodatak
    case GPS_ODBIJENO:
      return (
        'Pristup lokaciji nije dozvoljen. Dozvolu možete promijeniti u postavkama preglednika.' + dodatak
      )
    case GPS_NEDOSTUPNO:
      return 'Lokaciju trenutno nije moguće odrediti (npr. GPS je isključen ili nema signala).' + dodatak
    case GPS_ISTEKLO_VRIJEME:
      return 'Određivanje lokacije traje predugo.' + dodatak
    default:
      return 'Lokaciju nije moguće odrediti.' + dodatak
  }
}
