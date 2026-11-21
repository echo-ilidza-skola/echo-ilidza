// Prikaz datuma na bosanskom: "21. 11. 2026." ili "21. 11. 2026. u 09:05".
// Koristi se lokalno vrijeme uređaja.

function dvijeCifre(broj) {
  return String(broj).padStart(2, '0')
}

export function formatirajDatum(iso, saVremenom = false) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'nepoznat datum'
  const datum = `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}.`
  if (!saVremenom) return datum
  return `${datum} u ${dvijeCifre(d.getHours())}:${dvijeCifre(d.getMinutes())}`
}
