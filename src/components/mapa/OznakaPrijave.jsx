// Jedna prijava na mapi. Klik (ili Enter na tastaturi) otvara sažetak s linkom na detalje.
// Dok je sažetak otvoren, oznaka je "odabrana": malo veća i s blagim sjajem (klasa na postojećem
// elementu, bez pravljenja nove ikone, pa fokus tastature ostaje na oznaci).

import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { napraviIkonu } from './ikonaOznake.js'
import StatusOznaka from '../StatusOznaka.jsx'
import KategorijaOznaka from '../KategorijaOznaka.jsx'
import { formatirajDatum } from '../../logic/datum.js'

const KLASA_ODABRANE = 'oznaka-omotac--odabrana'

const DOGADJAJI = {
  popupopen: (e) => e.target.getElement()?.classList.add(KLASA_ODABRANE),
  popupclose: (e) => e.target.getElement()?.classList.remove(KLASA_ODABRANE),
}

export default function OznakaPrijave({ prijava }) {
  // Ikonu pravimo ponovo samo kad se promijeni nešto što se na njoj vidi.
  const ikona = useMemo(
    () => napraviIkonu(prijava),
    [prijava.naslov, prijava.kategorija, prijava.status, prijava.brojPrijavitelja],
  )

  return (
    <Marker position={[prijava.lat, prijava.lng]} icon={ikona} eventHandlers={DOGADJAJI}>
      <Popup>
        <div className="sazetak">
          <strong className="sazetak-naslov">{prijava.naslov}</strong>
          <KategorijaOznaka kategorija={prijava.kategorija} />
          <StatusOznaka status={prijava.status} />
          <span>Prijavljeno: {formatirajDatum(prijava.datumPrijave)}</span>
          {prijava.brojPrijavitelja > 1 && <span>Broj prijavitelja: {prijava.brojPrijavitelja}</span>}
          <Link to={`/prijava/${prijava.id}`}>Pogledaj detalje</Link>
        </div>
      </Popup>
    </Marker>
  )
}
