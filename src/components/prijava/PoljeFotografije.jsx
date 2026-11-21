// Fotografija (neobavezno): upozorenje, odabir, pregled i "Ukloni fotografiju".

import Ikona from '../Ikona.jsx'

export const UPOZORENJE_FOTO = 'Ne fotografišite lica ni registarske oznake. Fotografija treba prikazati samo problem.'

export default function PoljeFotografije({ foto, obrada, greska, odaberi, ukloni }) {
  return (
    <div className="polje">
      <span className="oznaka-polja" id="foto-oznaka">
        Fotografija (neobavezno)
      </span>
      <p className="upozorenje-okvir" id="foto-upozorenje">
        <span aria-hidden="true">⚠ </span>
        {UPOZORENJE_FOTO}
      </p>

      {foto ? (
        <div className="foto-pregled">
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
      ) : (
        <label className="dugme dugme-sporedno foto-odabir">
          <Ikona ime="prijavi" velicina={18} />
          {obrada ? 'Obrađujem fotografiju…' : 'Dodaj fotografiju'}
          <input
            type="file"
            accept="image/*"
            className="vizuelno-skriveno"
            disabled={obrada}
            aria-labelledby="foto-oznaka"
            aria-describedby="foto-upozorenje"
            onChange={(e) => {
              const fajl = e.target.files && e.target.files[0]
              e.target.value = '' // da se ista slika može ponovo odabrati
              if (fajl) odaberi(fajl)
            }}
          />
        </label>
      )}

      {greska && (
        <p className="greska-polja" role="alert">
          {greska}
        </p>
      )}
    </div>
  )
}
