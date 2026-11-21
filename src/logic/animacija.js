// Čista matematika za animacije (bez Reacta), da se može testirati.

// "Ease-out": brzo na početku, polako pred kraj. napredak je broj od 0 do 1.
export function easeOut(napredak) {
  const t = Math.min(1, Math.max(0, napredak))
  return 1 - Math.pow(1 - t, 3)
}

// Cijeli broj koji se prikazuje dok brojanje ide od 0 do cilja.
export function vrijednostBrojanja(cilj, napredak) {
  return Math.round(cilj * easeOut(napredak))
}
