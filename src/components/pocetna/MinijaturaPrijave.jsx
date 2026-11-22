// Mala fotografija iz lokalne baze; bez fotografije prikazujemo ikonu kategorije.
// Fotografije se prikazuju samo kad ih javni prikaz dozvoljava.
import { useEffect, useState } from 'react'
import { ucitajFotografiju } from '../../data/storage.js'
import Ikona from '../Ikona.jsx'

export default function MinijaturaPrijave({ prijava, boja }) {
  const [url, postaviUrl] = useState(null)
  useEffect(() => {
    if (!prijava.fotografijaId) { postaviUrl(null); return }
    let aktivno = true
    let objektUrl
    ucitajFotografiju(prijava.fotografijaId).then((blob) => {
      if (!aktivno || !blob) return
      objektUrl = URL.createObjectURL(blob)
      postaviUrl(objektUrl)
    }).catch(() => { if (aktivno) postaviUrl(null) })
    return () => { aktivno = false; if (objektUrl) URL.revokeObjectURL(objektUrl) }
  }, [prijava.fotografijaId])

  if (url) return <img className="prijava-minijatura" src={url} alt="" loading="lazy" />
  return (
    <span className="kategorija-plocica" style={{ '--boja-kategorije': boja }} aria-hidden="true">
      <Ikona ime={prijava.kategorija} velicina={24} />
    </span>
  )
}
