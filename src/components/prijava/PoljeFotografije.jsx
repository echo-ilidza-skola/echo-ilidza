// Fotografija (neobavezno), na POČETKU prijave: upozorenje, "Fotografiši problem" (kamera telefona),
// "Iz galerije", pregled i "Ukloni fotografiju".
// Kamera se otvara preko običnog polja za fajl s capture="environment" – telefon otvori svoju
// kameru, bez posebnih dozvola. Na računaru oba dugmeta otvaraju izbor fajla.

import Ikona from '../Ikona.jsx'
import { useJezik } from '../../jezik/JezikContext.jsx'


// Skriveno polje za fajl unutar labele koja izgleda kao dugme.
function DugmeFotografije({ ikona, tekst, kamera, obrada, odaberi, glavno }) {
  return (
    <label className={`dugme ${glavno ? 'dugme-glavno' : 'dugme-sporedno'} foto-odabir`}>
      <Ikona ime={ikona} velicina={20} />
      {tekst}
      <input
        type="file"
        accept="image/*"
        capture={kamera ? 'environment' : undefined}
        className="vizuelno-skriveno"
        disabled={obrada}
        aria-describedby="foto-upozorenje"
        onChange={(e) => {
          const fajl = e.target.files && e.target.files[0]
          e.target.value = '' // da se ista slika može ponovo odabrati
          if (fajl) odaberi(fajl)
        }}
      />
    </label>
  )
}

export default function PoljeFotografije({ foto, obrada, greska, odaberi, ukloni }) {
  const { t } = useJezik()
  return (
    <section className="foto-polje" aria-labelledby="foto-oznaka">
      <h3 id="foto-oznaka" className="oznaka-polja">
        {t('obrazacFoto.naslov')} <span className="prigusen">{t('obrazacFoto.neobavezno')}</span>
      </h3>

      {/* Upozorenje je vidljivo PRIJE nego se kamera otvori. */}
      <p className="upozorenje-okvir" id="foto-upozorenje">
        <span aria-hidden="true">⚠ </span>
        {t('obrazacFoto.upozorenje')}
      </p>

      {foto ? (
        <div className="foto-pregled foto-pregled--veliki">
          <img src={foto.url} alt={t('obrazacFoto.pregledAlt')} />
          <p className="prigusen mali-tekst">
            {t('obrazacFoto.smanjeno', { sirina: foto.sirina, visina: foto.visina, kb: Math.round(foto.blob.size / 1024) })}
          </p>
          <button type="button" className="dugme dugme-upozorenje" onClick={ukloni}>
            <Ikona ime="zatvori" velicina={18} />
            {t('obrazacFoto.ukloni')}
          </button>
        </div>
      ) : obrada ? (
        <p className="foto-obrada" role="status">
          {t('obrazacFoto.obrada')}
        </p>
      ) : (
        <div className="foto-dugmad">
          <DugmeFotografije ikona="kamera" tekst={t('obrazacFoto.fotografisi')} kamera glavno odaberi={odaberi} />
          <DugmeFotografije ikona="galerija" tekst={t('obrazacFoto.galerija')} odaberi={odaberi} />
        </div>
      )}

      {greska && (
        <p className="greska-polja" role="alert">
          {greska}
        </p>
      )}
    </section>
  )
}
