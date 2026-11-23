// Prikazuje ekran samo ako je odabrana odgovarajuća DEMO uloga.
// Ovo NIJE zaštita podataka: svako može promijeniti ulogu u zaglavlju.

import { useUloga } from '../context/UlogaContext.jsx'
import TrakaStranice from './TrakaStranice.jsx'
import { useJezik } from '../jezik/JezikContext.jsx'

// naslov: KLJUČ naslova stranice u rječniku (npr. 'nav.prijavi'), prikazuje se u traci i kad je odabrana druga uloga.
export default function ZasticenaRuta({ uloge, naslov, children }) {
  const { uloga, promijeniUlogu } = useUloga()
  const { t } = useJezik()

  if (uloge.includes(uloga)) return children

  const potrebna = uloge[0]
  return (
    <>
      <TrakaStranice naslov={t(naslov)} />
      <section>
        <div className="kartica">
          <h2>{t('zasticena.naslov', { uloga: t(`uloge.${potrebna}`) })}</h2>
          <p>{t('zasticena.trenutna', { uloga: t(`uloge.${uloga}`) })}</p>
          <p className="prigusen">{t('zasticena.napomena')}</p>
          <button type="button" className="dugme" onClick={() => promijeniUlogu(potrebna)}>
            {t('zasticena.dugme', { uloga: t(`uloge.${potrebna}`) })}
          </button>
        </div>
      </section>
    </>
  )
}
