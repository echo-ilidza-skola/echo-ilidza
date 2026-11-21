// Red čekanja: prijave koje čekaju provjeru, najstarije prve. Svaka se odobri ili odbije.

import { useState } from 'react'
import AdminPrijava from './AdminPrijava.jsx'

// Pravilan oblik riječi uz broj: 1 prijava čeka, 2–4 prijave čekaju, 5 i više prijava čeka.
function oblikPrijava(broj) {
  const zadnjaDva = broj % 100
  const zadnja = broj % 10
  if (zadnja === 1 && zadnjaDva !== 11) return 'prijava čeka'
  if (zadnja >= 2 && zadnja <= 4 && (zadnjaDva < 12 || zadnjaDva > 14)) return 'prijave čekaju'
  return 'prijava čeka'
}

export default function RedCekanja({ sve }) {
  const [poruka, postaviPoruku] = useState(null)
  const naCekanju = sve
    .filter((p) => p.status === 'NA_CEKANJU')
    .sort((a, b) => new Date(a.datumPrijave) - new Date(b.datumPrijave))

  return (
    <div>
      <p className="admin-poruka" role="status" aria-live="polite">
        {poruka}
      </p>
      {naCekanju.length === 0 ? (
        <div className="kartica">
          <p>Nema prijava na čekanju provjere.</p>
        </div>
      ) : (
        <>
          <p className="prigusen">
            {naCekanju.length} {oblikPrijava(naCekanju.length)} provjeru (najstarije prve).
            Nijedna prijava nije javna dok je ne odobrite.
          </p>
          {naCekanju.map((p) => (
            <AdminPrijava key={p.id} prijava={p} sve={sve} naOdluku={postaviPoruku} />
          ))}
        </>
      )}
    </div>
  )
}
