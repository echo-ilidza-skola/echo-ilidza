// Statistika za administraciju: SVE prijave (i one koje nisu javne), testni podaci.

import TrakastiGrafikon from './TrakastiGrafikon.jsx'
import {
  brojPoKategoriji,
  brojPoStatusu,
  brojPoNaselju,
  prosjecnoVrijemeRjesavanjaDana,
} from '../../logic/statistika.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Boje traka po statusu (iste nijanse kao natpisi statusa).
const BOJE_STATUSA = {
  NA_CEKANJU: 'var(--grafikon-na_cekanju)',
  ODBIJENO: 'var(--grafikon-odbijeno)',
  ZAPRIMLJENO: 'var(--grafikon-zaprimljeno)',
  U_OBRADI: 'var(--grafikon-u_obradi)',
  PROSLIJEDJENO: 'var(--grafikon-proslijedjeno)',
  RIJESENO: 'var(--grafikon-rijeseno)',
}

export default function StatistikaAdmin({ sve }) {
  const prosjek = prosjecnoVrijemeRjesavanjaDana(sve)
  const brojRijesenih = sve.filter((p) => p.status === 'RIJESENO').length
  const { t } = useJezik()

  return (
    <div>
      <div className="admin-kpi">
        <div className="admin-kpi-stavka">
          <span className="admin-kpi-broj">{sve.length}</span>
          <span>{t('stat.ukupno')}</span>
        </div>
        <div className="admin-kpi-stavka">
          <span className="admin-kpi-broj">
            {prosjek === null ? '–' : prosjek.toFixed(1).replace('.', ',')}
          </span>
          <span>
            {t('stat.prosjek')}
            <span className="prigusen mali-tekst">{t('stat.naOsnovu', { broj: brojRijesenih })}</span>
          </span>
        </div>
      </div>

      <div className="admin-grafikoni">
        <TrakastiGrafikon
          naslov={t('stat.poKategoriji')}
          stavke={brojPoKategoriji(sve).map((k) => ({ naziv: t(`kategorije.${k.kljuc}`), broj: k.broj, boja: k.boja }))}
        />
        <TrakastiGrafikon
          naslov={t('stat.poStatusu')}
          stavke={brojPoStatusu(sve).map((s) => ({ naziv: t(`statusi.${s.kljuc}`), broj: s.broj, boja: BOJE_STATUSA[s.kljuc] }))}
        />
        <TrakastiGrafikon
          naslov={t('stat.poNaselju')}
          stavke={brojPoNaselju(sve).map((n) => (n.nepoznato ? { ...n, naziv: t('stat.nepoznato') } : n))}
        />
      </div>
      <p className="prigusen mali-tekst">
        {t('stat.napomena')}
      </p>
    </div>
  )
}
