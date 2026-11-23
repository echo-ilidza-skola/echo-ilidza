// Prikaz datuma: "21. 11. 2026." ili "21. 11. 2026. u 09:05" (na engleskom "… at 09:05").
// Koristi se lokalno vrijeme uređaja.

import { prevedi } from '../jezik/prevodi.js'

function dvijeCifre(broj) {
  return String(broj).padStart(2, '0')
}

export function formatirajDatum(iso, saVremenom = false, jezik = 'bs') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return prevedi(jezik, 'datum.nepoznat')
  const datum = `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}.`
  if (!saVremenom) return datum
  return `${datum} ${prevedi(jezik, 'datum.u')} ${dvijeCifre(d.getHours())}:${dvijeCifre(d.getMinutes())}`
}
