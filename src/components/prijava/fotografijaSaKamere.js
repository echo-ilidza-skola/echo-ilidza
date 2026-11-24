// Prenos fotografije s dugmeta kamere u donjoj navigaciji do ekrana "Prijavi problem".
// Dugme kamere otvori kameru telefona; kad korisnik snimi fotografiju, fajl se ovdje kratko
// ostavi (samo u memoriji, ništa se ne sprema), a ekran prijave ga odmah preuzme i doda u prijavu.

let fajlSaKamere = null

// Dugme kamere ostavlja snimljeni fajl.
export function predajFotografiju(fajl) {
  fajlSaKamere = fajl
}

// Ekran prijave uzima fajl (samo jednom); ako fajla nema, vraća null.
export function preuzmiFotografiju() {
  const fajl = fajlSaKamere
  fajlSaKamere = null
  return fajl
}
