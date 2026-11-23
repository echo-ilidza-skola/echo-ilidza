// Fotografije za TESTNE prijave. Sve su u JEDNOM folderu (src/assets/testne-fotografije/), a koja
// fotografija pripada kojoj prijavi piše u spisku src/assets/testne-fotografije/spisak.js (jedan red po prijavi).
// Ovaj fajl se ne mijenja kad se fotografija zamijeni – dovoljno je zamijeniti fajl ili jedan red u spisku.
// Fotografije su privremene; zamijenit će ih fotografije koje snime učenici (bez lica i registarskih oznaka).

import { SPISAK_TESTNIH_FOTOGRAFIJA } from '../assets/testne-fotografije/spisak.js'

// Vite unaprijed pronađe sve slike u folderu i da nam adresu (URL) svake od njih.
const FOLDER = '../assets/testne-fotografije/'
const ADRESE_SLIKA = import.meta.glob('../assets/testne-fotografije/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Ključ fotografije testne prijave počinje s "test:", da storage.js zna da je u projektu, a ne u IndexedDB.
export const PREFIKS_TESTNE_FOTOGRAFIJE = 'test:'

// { t02: { url, fajl, izvor }, ... } – samo fotografije koje stvarno postoje u folderu.
export const TESTNE_FOTOGRAFIJE = Object.fromEntries(
  Object.entries(SPISAK_TESTNIH_FOTOGRAFIJA)
    .map(([id, stavka]) => [id, { ...stavka, url: ADRESE_SLIKA[FOLDER + stavka.fajl] }])
    .filter(([id, stavka]) => {
      if (!stavka.url) console.warn(`Testna fotografija "${stavka.fajl}" (prijava ${id}) ne postoji u folderu.`)
      return Boolean(stavka.url)
    }),
)

// Ključ fotografije za testnu prijavu (ili null ako prijava nema fotografiju).
export function kljucTestneFotografije(idPrijave) {
  return TESTNE_FOTOGRAFIJE[idPrijave] ? PREFIKS_TESTNE_FOTOGRAFIJE + idPrijave : null
}

// Da li je fotografija s ovim ključem testna (iz projekta), a ne fotografija koju je dodao građanin.
export function jeTestnaFotografija(kljuc) {
  return typeof kljuc === 'string' && kljuc.startsWith(PREFIKS_TESTNE_FOTOGRAFIJE)
}

// Dopuna za podatke spremljene PRIJE nego što su testne prijave dobile fotografije:
// testnoj prijavi koja nema nikakvu fotografiju upisuje ključ njene testne fotografije.
// Nove prijave građana i prijave koje već imaju fotografiju ostaju nepromijenjene.
// Vraća novu listu i broj dopunjenih prijava.
export function dopuniTestneFotografije(prijave) {
  let dopunjeno = 0
  const nove = prijave.map((p) => {
    const kljuc = kljucTestneFotografije(p.id)
    if (!p.testniPodatak || !kljuc || p.fotografijaId) return p
    dopunjeno += 1
    return { ...p, fotografijaId: kljuc }
  })
  return { prijave: nove, dopunjeno }
}
