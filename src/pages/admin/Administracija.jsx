// Administracija: red čekanja, sve prijave, statistika i vraćanje testnih podataka.
// Demo uloga "Administrator" NIJE zaštita podataka – svako je može odabrati u zaglavlju.

import { useSearchParams } from 'react-router-dom'
import RedCekanja from '../../components/admin/RedCekanja.jsx'
import SvePrijave from '../../components/admin/SvePrijave.jsx'
import StatistikaAdmin from '../../components/admin/StatistikaAdmin.jsx'
import { usePodaci } from '../../hooks/usePodaci.js'
import { svePrijave, vratiTestnePodatke } from '../../data/storage.js'
import TrakaStranice from '../../components/TrakaStranice.jsx'

const KARTICE = [
  { kljuc: 'red', naziv: 'Red čekanja' },
  { kljuc: 'sve', naziv: 'Sve prijave' },
  { kljuc: 'statistika', naziv: 'Statistika' },
]

export default function Administracija() {
  const sve = usePodaci(svePrijave)
  // Odabrana kartica je u adresi (#/admin?kartica=sve), pa ostaje i nakon osvježavanja.
  const [parametri, postaviParametre] = useSearchParams()
  const aktivna = KARTICE.some((k) => k.kljuc === parametri.get('kartica')) ? parametri.get('kartica') : 'red'
  const brojNaCekanju = sve.filter((p) => p.status === 'NA_CEKANJU').length

  function naVratiTestnePodatke() {
    const potvrda = window.confirm(
      'Ovo briše SVE prijave i fotografije u ovom pregledniku (i vaše izmjene) i ponovo učitava 28 testnih prijava. Ovo se ne može poništiti. Nastaviti?',
    )
    if (potvrda) vratiTestnePodatke()
  }

  return (
    <>
      <TrakaStranice naslov="Administracija" />
      <section className="admin-stranica">
        <p className="uvod">
          Demo uloga – nije prijava korisnika ni zaštita podataka. Aplikacija ne šalje ništa Općini ni službama;
          „Proslijeđeno službi“ je samo simulacija.
        </p>

        <div className="admin-kartice" role="tablist" aria-label="Dijelovi administracije">
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
              {k.naziv}
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
          <h2>Testni podaci</h2>
          <p>Vraća početnih 28 testnih prijava. Briše sve nove prijave, izmjene i fotografije u ovom pregledniku.</p>
          <button type="button" className="dugme dugme-upozorenje" onClick={naVratiTestnePodatke}>
            Vrati testne podatke
          </button>
        </div>
      </section>
    </>
  )
}
