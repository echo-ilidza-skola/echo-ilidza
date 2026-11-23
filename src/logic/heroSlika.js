// Računanje dijela hero slike koji se stvarno vidi (bez React koda).
// Slika (1672 × 941 px) se prikazuje kao "cover" poravnat uz DNO okvira (xMidYMax slice):
// ako je okvir širi od slike, odsijeca se VRH slike.

export const SIRINA_SLIKE = 1672
export const VISINA_SLIKE = 941

// Prvi red slike (u pikselima slike) koji se vidi ispod zaglavlja.
//   sirina, visina: veličina okvira na ekranu (CSS pikseli)
//   preklopZaglavlja: koliko piksela zaglavlje prekriva vrh okvira (0 ako ne prekriva)
export function prviVidljiviRed(sirina, visina, preklopZaglavlja = 0) {
  if (!sirina || !visina) return 0
  // Koliko puta je slika uvećana na ekranu ("cover" uzima veće uvećanje).
  const mjerilo = Math.max(sirina / SIRINA_SLIKE, visina / VISINA_SLIKE)
  // Odsječeni vrh slike + dio koji prekriva zaglavlje (pretvoreno u piksele slike).
  const odsjecenVrh = VISINA_SLIKE - visina / mjerilo
  return odsjecenVrh + preklopZaglavlja / mjerilo
}

// Pretvara pravougaonik s ekrana (u pikselima, mjereno od gornjeg lijevog ugla okvira slike)
// u piksele slike. Slika je centrirana vodoravno (xMid) i poravnata uz dno (YMax).
export function pravougaonikUSliku(pravougaonik, sirina, visina) {
  const mjerilo = Math.max(sirina / SIRINA_SLIKE, visina / VISINA_SLIKE)
  const pomakX = (sirina - SIRINA_SLIKE * mjerilo) / 2
  const pomakY = visina - VISINA_SLIKE * mjerilo
  return {
    lijevo: (pravougaonik.lijevo - pomakX) / mjerilo,
    desno: (pravougaonik.desno - pomakX) / mjerilo,
    gore: (pravougaonik.gore - pomakY) / mjerilo,
    dolje: (pravougaonik.dolje - pomakY) / mjerilo,
  }
}

function sijekuSe(a, b) {
  return a.lijevo < b.desno && a.desno > b.lijevo && a.gore < b.dolje && a.dolje > b.gore
}

// Raspoređuje oznake na slici (sve mjere su u pikselima slike):
//   - oznaka se spušta tako da cijela bude ispod zaglavlja (najvisiVrh = najmanji dozvoljeni y vrha oznake);
//   - ako bi oznaka pala na tekst, podiže se iznad teksta; ako tamo nema mjesta, ne prikazuje se.
//   oznake: [{ x, y }] (y je vrh oznake, tj. tačka na slici)
//   tekst: { lijevo, desno, gore, dolje } ili null
//   sirinaOznake, visinaOznake: veličina nacrtane oznake; razmak: slobodan prostor oko teksta
export function rasporediOznake(oznake, { najvisiVrh, tekst, sirinaOznake, visinaOznake, razmak = 20 }) {
  const rezultat = []
  for (const o of oznake) {
    let y = Math.max(o.y, najvisiVrh)
    if (tekst && sijekuSe(okvirOznake(o.x, y, sirinaOznake, visinaOznake, razmak), tekst)) {
      y = tekst.gore - razmak
      if (y < najvisiVrh) continue // nema mjesta iznad teksta – oznaka se ne crta
    }
    rezultat.push({ x: o.x, y })
  }
  return rezultat
}

function okvirOznake(x, y, sirina, visina, razmak) {
  return { lijevo: x - sirina / 2 - razmak, desno: x + sirina / 2 + razmak, gore: y - visina - razmak, dolje: y + razmak }
}
