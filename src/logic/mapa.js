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

// Pretvara geografsku tačku u tačku na slici (npr. SVG širine × visine) unutar zadanog okvira.
// Sjever je gore, zato se y računa od maxLat. Tačke izvan okvira se "pritegnu" na rub.
export function projektujTacku(tacka, okvir, sirina, visina) {
  const x = ((tacka.lng - okvir.minLng) / (okvir.maxLng - okvir.minLng)) * sirina
  const y = ((okvir.maxLat - tacka.lat) / (okvir.maxLat - okvir.minLat)) * visina
  return {
    x: Math.min(sirina, Math.max(0, x)),
    y: Math.min(visina, Math.max(0, y)),
  }
}

// Najmanji okvir koji obuhvata sve tačke, uvećan za "rezervu" (udio širine/visine) sa svake strane.
// Za praznu listu vraća "zamjenu" (npr. okvir Ilidže).
export function okvirTacaka(tacke, zamjena, rezerva = 0.12) {
  if (!tacke || tacke.length === 0) return zamjena
  const latovi = tacke.map((t) => t.lat)
  const lngovi = tacke.map((t) => t.lng)
  let minLat = Math.min(...latovi)
  let maxLat = Math.max(...latovi)
  let minLng = Math.min(...lngovi)
  let maxLng = Math.max(...lngovi)
  // Jedna tačka (ili sve na istom mjestu): napravimo mali okvir oko nje.
  const dLat = Math.max(maxLat - minLat, 0.01)
  const dLng = Math.max(maxLng - minLng, 0.01)
  return {
    minLat: minLat - dLat * rezerva,
    maxLat: maxLat + dLat * rezerva,
    minLng: minLng - dLng * rezerva,
    maxLng: maxLng + dLng * rezerva,
  }
}

// Zadržava prijave čija je kategorija I status među odabranima.
// filteri: { kategorije: ['ceste', ...], statusi: ['ZAPRIMLJENO', ...] }
export function filtrirajPrijave(prijave, filteri) {
  return prijave.filter(
    (p) => filteri.kategorije.includes(p.kategorija) && filteri.statusi.includes(p.status),
  )
}
