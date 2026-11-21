// Fotografija (neobavezno), na POČETKU prijave: upozorenje, "Fotografiši problem" (kamera telefona),
// "Iz galerije", pregled i "Ukloni fotografiju".
// Kamera se otvara preko običnog polja za fajl s capture="environment" – telefon otvori svoju
// kameru, bez posebnih dozvola. Na računaru oba dugmeta otvaraju izbor fajla.

import Ikona from '../Ikona.jsx'

export const UPOZORENJE_FOTO = 'Ne fotografišite lica ni registarske oznake. Fotografija treba prikazati samo problem.'

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
  return (
    <section className="foto-polje" aria-labelledby="foto-oznaka">
      <h3 id="foto-oznaka" className="oznaka-polja">
        Fotografija problema <span className="prigusen">(neobavezno)</span>
      </h3>

      {/* Upozorenje je vidljivo PRIJE nego se kamera otvori. */}
      <p className="upozorenje-okvir" id="foto-upozorenje">
        <span aria-hidden="true">⚠ </span>
        {UPOZORENJE_FOTO}
      </p>

      {foto ? (
        <div className="foto-pregled foto-pregled--veliki">
          <img src={foto.url} alt="Pregled odabrane fotografije" />
          <p className="prigusen mali-tekst">
            Smanjeno na {foto.sirina} × {foto.visina} px, {Math.round(foto.blob.size / 1024)} kB. Podaci o lokaciji i
            uređaju iz fotografije (EXIF) su uklonjeni.
          </p>
          <button type="button" className="dugme dugme-upozorenje" onClick={ukloni}>
            <Ikona ime="zatvori" velicina={18} />
            Ukloni fotografiju
          </button>
        </div>
      ) : obrada ? (
        <p className="foto-obrada" role="status">
          Obrađujem fotografiju…
        </p>
      ) : (
        <div className="foto-dugmad">
          <DugmeFotografije ikona="kamera" tekst="Fotografiši problem" kamera glavno odaberi={odaberi} />
          <DugmeFotografije ikona="galerija" tekst="Iz galerije" odaberi={odaberi} />
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
