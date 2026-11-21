// Prijedlog kategorije na osnovu KLJUČNIH RIJEČI (pravila, ne AI).
// Pravilo: u naslovu i opisu prebrojimo pogotke ključnih riječi svake kategorije
// i predložimo kategoriju s najviše pogodaka. Bez pogodaka nema prijedloga.
// Ako dvije kategorije imaju isti broj pogodaka, bira se ona koja je ranije na listi KATEGORIJE.

import { KATEGORIJE } from '../data/konstante.js'
import { pronadjiKljucneRijeci } from './tekst.js'

// Vraća:
// {
//   kategorija: 'ceste' ili null,
//   pogoci: [{ kategorija: 'ceste', broj: 3, rijeci: ['rupa', 'asfalt'] }, ...]  (samo kategorije s pogocima, od najviše)
// }
export function predloziKategoriju(naslov, opis) {
  const tekst = `${naslov || ''} ${opis || ''}`

  const pogoci = []
  for (const kategorija of KATEGORIJE) {
    const pronadjene = pronadjiKljucneRijeci(tekst, kategorija.kljucneRijeci)
    const broj = pronadjene.reduce((zbir, p) => zbir + p.broj, 0)
    if (broj > 0) {
      pogoci.push({ kategorija: kategorija.kljuc, broj, rijeci: pronadjene.map((p) => p.rijec) })
    }
  }

  // sort je stabilan: kod istog broja pogodaka ostaje redoslijed iz KATEGORIJE.
  pogoci.sort((a, b) => b.broj - a.broj)

  return {
    kategorija: pogoci.length > 0 ? pogoci[0].kategorija : null,
    pogoci,
  }
}
