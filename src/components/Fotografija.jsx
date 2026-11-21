// Prikazuje fotografiju prijave iz IndexedDB-a (preko storage.js).
// Ako fotografija ne postoji u ovom pregledniku, to se jasno kaže.

import { useEffect, useState } from 'react'
import { ucitajFotografiju } from '../data/storage.js'

export default function Fotografija({ id, alt, className = '' }) {
  const [stanje, postaviStanje] = useState({ ucitava: true, url: null })

  useEffect(() => {
    let aktivno = true
    let url = null
    postaviStanje({ ucitava: true, url: null })
    ucitajFotografiju(id).then((blob) => {
      if (!aktivno) return
      url = blob ? URL.createObjectURL(blob) : null
      postaviStanje({ ucitava: false, url })
    })
    // Kad se komponenta ukloni, oslobodimo memoriju koju zauzima privremeni URL slike.
    return () => {
      aktivno = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [id])

  if (stanje.ucitava) return <p className="prigusen mali-tekst">Učitavam fotografiju…</p>
  if (!stanje.url) {
    return <p className="prigusen mali-tekst">Fotografija nije dostupna u ovom pregledniku.</p>
  }
  return <img className={`fotografija ${className}`} src={stanje.url} alt={alt} />
}
