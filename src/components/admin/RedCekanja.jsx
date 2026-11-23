// Red čekanja: prijave koje čekaju provjeru, najstarije prve. Svaka se odobri ili odbije.

import { useState } from 'react'
import AdminPrijava from './AdminPrijava.jsx'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Pravilan oblik riječi uz broj: 1 prijava čeka, 2–4 prijave čekaju, 5 i više prijava čeka.
// Ključ rečenice prema broju (bosanski: "1 prijava čeka", "3 prijave čekaju", "5 prijava čeka").
function kljucOblika(broj) {
  const zadnjaDva = broj % 100
  const zadnja = broj % 10
  if (zadnja === 1 && zadnjaDva !== 11) return 'red.jedna'
  if (zadnja >= 2 && zadnja <= 4 && (zadnjaDva < 12 || zadnjaDva > 14)) return 'red.vise'
  return 'red.mnogo'
}

export default function RedCekanja({ sve }) {
  const [poruka, postaviPoruku] = useState(null)
  const { t } = useJezik()
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
          <p>{t('red.nema')}</p>
        </div>
      ) : (
        <>
          <p className="prigusen">
            {t(kljucOblika(naCekanju.length), { broj: naCekanju.length })}
          </p>
          {naCekanju.map((p) => (
            <AdminPrijava key={p.id} prijava={p} sve={sve} naOdluku={postaviPoruku} />
          ))}
        </>
      )}
    </div>
  )
}
