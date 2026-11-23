// Naziv kategorije s tačkicom u boji kategorije.

import { kategorijaPoKljucu } from '../data/konstante.js'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function KategorijaOznaka({ kategorija }) {
  const { t } = useJezik()
  const k = kategorijaPoKljucu(kategorija)
  if (!k) return <span>{t('opste.nepoznataKategorija')}</span>
  return (
    <span className="kategorija-natpis">
      <span className="kategorija-tacka" style={{ background: k.boja }} aria-hidden="true" />
      {t(`kategorije.${k.kljuc}`)}
    </span>
  )
}
