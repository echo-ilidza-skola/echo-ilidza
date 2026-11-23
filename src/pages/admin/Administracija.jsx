// Administracija: red čekanja, sve prijave, statistika i vraćanje testnih podataka.
// Demo uloga "Administrator" NIJE zaštita podataka – svako je može odabrati u zaglavlju.

import { useSearchParams } from 'react-router-dom'
import RedCekanja from '../../components/admin/RedCekanja.jsx'
import SvePrijave from '../../components/admin/SvePrijave.jsx'
import StatistikaAdmin from '../../components/admin/StatistikaAdmin.jsx'
import { usePodaci } from '../../hooks/usePodaci.js'
import { svePrijave, vratiTestnePodatke } from '../../data/storage.js'
import TrakaStranice from '../../components/TrakaStranice.jsx'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Nazivi kartica su u rječniku: admin.kartice.red, admin.kartice.sve, admin.kartice.statistika
const KARTICE = [{ kljuc: 'red' }, { kljuc: 'sve' }, { kljuc: 'statistika' }]

export default function Administracija() {
  const sve = usePodaci(svePrijave)
  const { t } = useJezik()
  // Odabrana kartica je u adresi (#/admin?kartica=sve), pa ostaje i nakon osvježavanja.
  const [parametri, postaviParametre] = useSearchParams()
  const aktivna = KARTICE.some((k) => k.kljuc === parametri.get('kartica')) ? parametri.get('kartica') : 'red'
  const brojNaCekanju = sve.filter((p) => p.status === 'NA_CEKANJU').length

  function naVratiTestnePodatke() {
    const potvrda = window.confirm(t('admin.resetPotvrda'))
    if (potvrda) vratiTestnePodatke()
  }

  return (
    <>
      <TrakaStranice naslov={t('nav.admin')} />
      <section className="admin-stranica">
        <p className="uvod">{t('admin.uvod')}</p>

        <div className="admin-kartice" role="tablist" aria-label={t('admin.dijelovi')}>
          {KARTICE.map((k) => (
            <button
              key={k.kljuc}
              type="button"
              role="tab"
              id={`kartica-${k.kljuc}`}
              aria-selected={aktivna === k.kljuc}
              aria-controls={`panel-${k.kljuc}`}
              className={aktivna === k.kljuc ? 'admin-kartica admin-kartica--aktivna' : 'admin-kartica'}
              onClick={() => postaviParametre({ kartica: k.kljuc })}
            >
              {t(`admin.kartice.${k.kljuc}`)}
              {k.kljuc === 'red' && <span className="admin-znacka">{brojNaCekanju}</span>}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${aktivna}`} aria-labelledby={`kartica-${aktivna}`}>
          {aktivna === 'red' && <RedCekanja sve={sve} />}
          {aktivna === 'sve' && <SvePrijave sve={sve} />}
          {aktivna === 'statistika' && <StatistikaAdmin sve={sve} />}
        </div>

        <div className="kartica admin-reset">
          <h2>{t('admin.testniPodaci')}</h2>
          <p>{t('admin.resetOpis')}</p>
          <button type="button" className="dugme dugme-upozorenje" onClick={naVratiTestnePodatke}>
            {t('admin.resetDugme')}
          </button>
        </div>
      </section>
    </>
  )
}
