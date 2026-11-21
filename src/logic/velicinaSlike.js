// Računa nove dimenzije fotografije prije spremanja.
// Pravilo: duža strana je najviše 1024 px; omjer strana ostaje isti; manje slike se ne povećavaju.

export const MAX_STRANA_SLIKE = 1024
export const JPEG_KVALITET = 0.7

// Vraća { sirina, visina } ili null ako dimenzije nisu ispravne.
export function noveDimenzije(sirina, visina, max = MAX_STRANA_SLIKE) {
  if (!(sirina > 0 && visina > 0)) return null
  const duza = Math.max(sirina, visina)
  if (duza <= max) return { sirina, visina }
  const omjer = max / duza
  return {
    // Najmanje 1 px, i za vrlo uske slike.
    sirina: Math.max(1, Math.round(sirina * omjer)),
    visina: Math.max(1, Math.round(visina * omjer)),
  }
}
