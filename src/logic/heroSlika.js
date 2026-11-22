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
