// Korak 1: fotografija (neobavezno), naslov, opis i kategorija (pločice s ikonama + prijedlog pravila).

import { KATEGORIJE, MAX_NASLOV, MAX_OPIS } from '../../data/konstante.js'
import { predloziKategoriju } from '../../logic/prijedlogKategorije.js'
import PrijedlogKategorije from './PrijedlogKategorije.jsx'
import PoljeFotografije from './PoljeFotografije.jsx'
import Ikona from '../Ikona.jsx'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Pomoćna komponenta: poruka greške ispod polja (povezana s poljem preko aria-describedby).
function Greska({ id, poruka }) {
  if (!poruka) return null
  return (
    <p id={id} className="greska-polja">
      {poruka}
    </p>
  )
}

// Kategorije kao pločice (radio dugmad): lakše se biraju palcem nego padajući izbornik.
function PlociceKategorija({ odabrana, predlozena, promijeni, greska }) {
  const { t } = useJezik()
  return (
    <fieldset className="kategorije-plocice" aria-describedby="kategorija-greska">
      <legend className="oznaka-polja">{t('obrazacOpis.kategorija')}</legend>
      <div className="plocice-mreza">
        {KATEGORIJE.map((k, i) => (
          <label
            key={k.kljuc}
            className={`plocica-kategorije ${odabrana === k.kljuc ? 'plocica-kategorije--odabrana' : ''}`}
            style={{ '--boja-kategorije': k.boja }}
          >
            <input
              type="radio"
              name="kategorija"
              // Prva pločica ima id "kategorija", da je obrazac može fokusirati kad nedostaje izbor.
              id={i === 0 ? 'kategorija' : undefined}
              value={k.kljuc}
              checked={odabrana === k.kljuc}
              onChange={() => promijeni('kategorija', k.kljuc)}
              aria-invalid={Boolean(greska)}
              className="vizuelno-skriveno"
            />
            <span className="plocica-ikona" aria-hidden="true">
              <Ikona ime={k.kljuc} velicina={24} />
            </span>
            <span className="plocica-naziv">{t(`kategorije.${k.kljuc}`)}</span>
            {predlozena === k.kljuc && <span className="plocica-prijedlog">{t('obrazacOpis.prijedlog')}</span>}
          </label>
        ))}
      </div>
      <Greska id="kategorija-greska" poruka={greska} />
    </fieldset>
  )
}

export default function KorakOpis({ unos, promijeni, greske, fotografija }) {
  const predlozena = predloziKategoriju(unos.naslov, unos.opis).kategorija
  const { t } = useJezik()

  return (
    <>
      <PoljeFotografije {...fotografija} />

      <div className="polje">
        <label htmlFor="naslov">{t('obrazacOpis.naslov')}</label>
        <input
          id="naslov"
          type="text"
          value={unos.naslov}
          maxLength={MAX_NASLOV}
          placeholder={t('obrazacOpis.naslovPrimjer')}
          onChange={(e) => promijeni('naslov', e.target.value)}
          aria-invalid={Boolean(greske.naslov)}
          aria-describedby="naslov-brojac naslov-greska"
        />
        <p id="naslov-brojac" className="brojac">
          {unos.naslov.length}/{MAX_NASLOV}
        </p>
        <Greska id="naslov-greska" poruka={greske.naslov} />
      </div>

      <div className="polje">
        <label htmlFor="opis">{t('obrazacOpis.opis')}</label>
        <textarea
          id="opis"
          rows={4}
          value={unos.opis}
          maxLength={MAX_OPIS}
          placeholder={t('obrazacOpis.opisPrimjer')}
          onChange={(e) => promijeni('opis', e.target.value)}
          aria-invalid={Boolean(greske.opis)}
          aria-describedby="opis-brojac opis-greska"
        />
        <p id="opis-brojac" className="brojac">
          {unos.opis.length}/{MAX_OPIS}
        </p>
        <Greska id="opis-greska" poruka={greske.opis} />
      </div>

      <div className="polje">
        <PrijedlogKategorije
          naslov={unos.naslov}
          opis={unos.opis}
          odabrana={unos.kategorija}
          prihvati={(k) => promijeni('kategorija', k)}
        />
        <PlociceKategorija
          odabrana={unos.kategorija}
          predlozena={predlozena}
          promijeni={promijeni}
          greska={greske.kategorija}
        />
      </div>
    </>
  )
}
