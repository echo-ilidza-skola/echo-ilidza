// Naziv kategorije s tačkicom u boji kategorije.

import { kategorijaPoKljucu } from '../data/konstante.js'

export default function KategorijaOznaka({ kategorija }) {
  const k = kategorijaPoKljucu(kategorija)
  if (!k) return <span>Nepoznata kategorija</span>
  return (
    <span className="kategorija-natpis">
      <span className="kategorija-tacka" style={{ background: k.boja }} aria-hidden="true" />
      {k.naziv}
    </span>
  )
}
