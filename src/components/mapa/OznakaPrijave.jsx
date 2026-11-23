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
import { useJezik } from '../../jezik/JezikContext.jsx'

const KLASA_ODABRANE = 'oznaka-omotac--odabrana'

const DOGADJAJI = {
  popupopen: (e) => e.target.getElement()?.classList.add(KLASA_ODABRANE),
  popupclose: (e) => e.target.getElement()?.classList.remove(KLASA_ODABRANE),
}

export default function OznakaPrijave({ prijava }) {
  const { jezik, t } = useJezik()
  // Ikonu pravimo ponovo samo kad se promijeni nešto što se na njoj vidi (ili jezik opisa).
  const ikona = useMemo(
    () => napraviIkonu(prijava, jezik),
    [prijava.naslov, prijava.kategorija, prijava.status, prijava.brojPrijavitelja, jezik],
  )

  return (
    <Marker position={[prijava.lat, prijava.lng]} icon={ikona} eventHandlers={DOGADJAJI}>
      <Popup>
        <div className="sazetak">
          <strong className="sazetak-naslov">{prijava.naslov}</strong>
          <KategorijaOznaka kategorija={prijava.kategorija} />
          <StatusOznaka status={prijava.status} />
          <span>{t('sazetak.prijavljeno', { datum: formatirajDatum(prijava.datumPrijave, false, jezik) })}</span>
          {prijava.brojPrijavitelja > 1 && <span>{t('sazetak.brojPrijavitelja', { broj: prijava.brojPrijavitelja })}</span>}
          <Link to={`/prijava/${prijava.id}`}>{t('sazetak.detalji')}</Link>
        </div>
      </Popup>
    </Marker>
  )
}
