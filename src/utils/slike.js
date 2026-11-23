// Priprema fotografije prije spremanja (radi samo u pregledniku, zato nije u src/logic).
//
// Sliku crtamo na canvas veličine najviše 1024 px po dužoj strani i spremamo kao JPEG kvaliteta 0.7.
// Novi JPEG sadrži samo piksele, pa time nestaju i EXIF podaci (npr. GPS koordinate i model telefona).

import { noveDimenzije, MAX_STRANA_SLIKE, JPEG_KVALITET } from '../logic/velicinaSlike.js'
import { napraviGresku } from '../jezik/greska.js'

// Veće fajlove ne pokušavamo ni učitati (npr. video greškom odabran kao slika).
export const MAX_VELICINA_FAJLA_MB = 40

// Učitava fajl kao sliku koju canvas može nacrtati.
async function ucitajSliku(fajl) {
  // createImageBitmap sam okrene sliku prema EXIF orijentaciji (uspravne fotografije s mobitela).
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(fajl, { imageOrientation: 'from-image' })
    } catch {
      // Neki preglednici ne poznaju opcije; probamo starim načinom ispod.
    }
  }
  const url = URL.createObjectURL(fajl)
  try {
    const slika = new Image()
    slika.src = url
    await slika.decode()
    return slika
  } finally {
    URL.revokeObjectURL(url)
  }
}

function canvasUBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('prazan rezultat'))),
      'image/jpeg',
      JPEG_KVALITET,
    )
  })
}

// Vraća { blob, sirina, visina } ili baca grešku s porukom na bosanskom (greška pamti i ključ prevoda).
export async function pripremiFotografiju(fajl) {
  if (!fajl || !fajl.type || !fajl.type.startsWith('image/')) {
    throw napraviGresku('greske.fotoNijeSlika')
  }
  if (fajl.size > MAX_VELICINA_FAJLA_MB * 1024 * 1024) {
    throw napraviGresku('greske.fotoPrevelika', { mb: MAX_VELICINA_FAJLA_MB })
  }

  let slika
  try {
    slika = await ucitajSliku(fajl)
  } catch {
    throw napraviGresku('greske.fotoFormat')
  }

  const dimenzije = noveDimenzije(slika.width, slika.height, MAX_STRANA_SLIKE)
  if (!dimenzije) throw napraviGresku('greske.fotoDimenzije')

  const canvas = document.createElement('canvas')
  canvas.width = dimenzije.sirina
  canvas.height = dimenzije.visina
  const ctx = canvas.getContext('2d')
  // Bijela pozadina, da prozirni dijelovi PNG slike ne postanu crni u JPEG-u.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(slika, 0, 0, canvas.width, canvas.height)
  if (typeof slika.close === 'function') slika.close()

  try {
    const blob = await canvasUBlob(canvas)
    return { blob, ...dimenzije }
  } catch {
    throw napraviGresku('greske.fotoObrada')
  }
}
