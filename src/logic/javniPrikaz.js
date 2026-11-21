// Pretvara prijavu u JAVNU verziju.
// Koristimo listu DOZVOLJENIH polja (a ne listu zabranjenih), da novo polje
// nikad slučajno ne "procuri" u javni prikaz.
// Autor, interna napomena i predloženi prioritet se NIKAD ne prikazuju javno.

import { JAVNI_STATUSI } from '../data/konstante.js'

const DOZVOLJENA_POLJA = [
  'id',
  'opcina',
  'naslov',
  'opis',
  'kategorija',
  'naselje',
  'lat',
  'lng',
  'datumPrijave',
  'status',
  'glavnaPrijavaId',
  'brojPrijavitelja',
  'testniPodatak',
]

export function jeJavna(prijava) {
  return Boolean(prijava) && JAVNI_STATUSI.includes(prijava.status)
}

// Vraća javnu kopiju prijave ili null ako prijava (još) nije javna.
export function uJavniPrikaz(prijava) {
  if (!jeJavna(prijava)) return null

  const javna = {}
  for (const polje of DOZVOLJENA_POLJA) {
    javna[polje] = prijava[polje]
  }
  // Fotografija se ne prikazuje ako ju je administrator sakrio.
  javna.fotografijaId = prijava.fotografijaSkrivena ? null : prijava.fotografijaId || null
  // Kopiramo historiju da javni prikaz ne može izmijeniti originalne podatke.
  javna.historijaStatusa = (prijava.historijaStatusa || []).map((korak) => ({ ...korak }))
  return javna
}
