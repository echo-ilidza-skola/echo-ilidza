// Statistika za administraciju: SVE prijave (i one koje nisu javne), testni podaci.

import TrakastiGrafikon from './TrakastiGrafikon.jsx'
import {
  brojPoKategoriji,
  brojPoStatusu,
  brojPoNaselju,
  prosjecnoVrijemeRjesavanjaDana,
} from '../../logic/statistika.js'

// Boje traka po statusu (iste nijanse kao natpisi statusa).
const BOJE_STATUSA = {
  NA_CEKANJU: '#8a9792',
  ODBIJENO: '#b42318',
  ZAPRIMLJENO: '#1f6fb2',
  U_OBRADI: '#b9731f',
  PROSLIJEDJENO: '#6b4e9b',
  RIJESENO: '#1f7a63',
}

export default function StatistikaAdmin({ sve }) {
  const prosjek = prosjecnoVrijemeRjesavanjaDana(sve)
  const brojRijesenih = sve.filter((p) => p.status === 'RIJESENO').length

  return (
    <div>
      <div className="admin-kpi">
        <div className="admin-kpi-stavka">
          <span className="admin-kpi-broj">{sve.length}</span>
          <span>Ukupno prijava</span>
        </div>
        <div className="admin-kpi-stavka">
          <span className="admin-kpi-broj">
            {prosjek === null ? '–' : prosjek.toFixed(1).replace('.', ',')}
          </span>
          <span>
            Prosječno dana od prijave do „Riješeno“
            <span className="prigusen mali-tekst"> (na osnovu {brojRijesenih} riješenih)</span>
          </span>
        </div>
      </div>

      <div className="admin-grafikoni">
        <TrakastiGrafikon
          naslov="Prijave po kategoriji"
          stavke={brojPoKategoriji(sve).map((k) => ({ naziv: k.naziv, broj: k.broj, boja: k.boja }))}
        />
        <TrakastiGrafikon
          naslov="Prijave po statusu"
          stavke={brojPoStatusu(sve).map((s) => ({ naziv: s.naziv, broj: s.broj, boja: BOJE_STATUSA[s.kljuc] }))}
        />
        <TrakastiGrafikon naslov="Prijave po naselju (približno)" stavke={brojPoNaselju(sve)} />
      </div>
      <p className="prigusen mali-tekst">
        Statistika uključuje sve prijave u ovom pregledniku, i one na čekanju i odbijene. Svi podaci su testni.
      </p>
    </div>
  )
}
