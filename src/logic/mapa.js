// Pravila za prikaz prijava na mapi.

// Povezane prijave se na mapi prikazuju kao JEDNA oznaka (glavna prijava),
// s brojem prijavitelja. Povezana prijava dobija svoju oznaku samo ako njena
// glavna prijava nije u listi (npr. glavna još nije javna).
export function grupisiZaMapu(javnePrijave) {
  const ids = new Set(javnePrijave.map((p) => p.id))
  return javnePrijave.filter((p) => !p.glavnaPrijavaId || !ids.has(p.glavnaPrijavaId))
}

// Javne prijave koje su povezane s glavnom prijavom.
export function povezanePrijave(glavnaId, javnePrijave) {
  return javnePrijave.filter((p) => p.glavnaPrijavaId === glavnaId)
}

// Zadržava prijave čija je kategorija I status među odabranima.
// filteri: { kategorije: ['ceste', ...], statusi: ['ZAPRIMLJENO', ...] }
export function filtrirajPrijave(prijave, filteri) {
  return prijave.filter(
    (p) => filteri.kategorije.includes(p.kategorija) && filteri.statusi.includes(p.status),
  )
}
