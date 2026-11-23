// Prikazuje fotografiju prijave iz IndexedDB-a (preko storage.js).
// Ako fotografija ne postoji u ovom pregledniku, to se jasno kaže.
// Testna fotografija (privremena, iz projekta) ima malu oznaku "Testna fotografija".

import { useEffect, useState } from 'react'
import { ucitajFotografiju } from '../data/storage.js'
import { jeTestnaFotografija } from '../data/testneFotografije.js'

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
  const slika = <img className={`fotografija ${className}`} src={stanje.url} alt={alt} />
  if (!jeTestnaFotografija(id)) return slika
  return (
    <span className="fotografija-okvir">
      {slika}
      <span className="oznaka-testna">Testna fotografija</span>
    </span>
  )
}
