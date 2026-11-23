// Prikazuje fotografiju prijave iz IndexedDB-a (preko storage.js).
// Ako fotografija ne postoji u ovom pregledniku, to se jasno kaže.
// Testna fotografija (privremena, iz projekta) ima malu oznaku "Testna fotografija".

import { useEffect, useState } from 'react'
import { ucitajFotografiju } from '../data/storage.js'
import { jeTestnaFotografija } from '../data/testneFotografije.js'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function Fotografija({ id, alt, className = '' }) {
  const [stanje, postaviStanje] = useState({ ucitava: true, url: null })
  const { t } = useJezik()

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

  if (stanje.ucitava) return <p className="prigusen mali-tekst">{t('foto.ucitava')}</p>
  if (!stanje.url) {
    return <p className="prigusen mali-tekst">{t('foto.nedostupna')}</p>
  }
  const slika = <img className={`fotografija ${className}`} src={stanje.url} alt={alt} />
  if (!jeTestnaFotografija(id)) return slika
  return (
    <span className="fotografija-okvir">
      {slika}
      <span className="oznaka-testna">{t('foto.testna')}</span>
    </span>
  )
}
