// Korak 1: naslov, opis, kategorija (s prijedlogom) i fotografija.

import { KATEGORIJE, MAX_NASLOV, MAX_OPIS } from '../../data/konstante.js'
import PrijedlogKategorije from './PrijedlogKategorije.jsx'
import PoljeFotografije from './PoljeFotografije.jsx'

// Pomoćna komponenta: poruka greške ispod polja (povezana s poljem preko aria-describedby).
function Greska({ id, poruka }) {
  if (!poruka) return null
  return (
    <p id={id} className="greska-polja">
      {poruka}
    </p>
  )
}

export default function KorakOpis({ unos, promijeni, greske, fotografija }) {
  return (
    <>
      <div className="polje">
        <label htmlFor="naslov">Naslov problema *</label>
        <input
          id="naslov"
          type="text"
          value={unos.naslov}
          maxLength={MAX_NASLOV}
          placeholder="npr. Udarna rupa ispred stanice"
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
        <label htmlFor="opis">Opis *</label>
        <textarea
          id="opis"
          rows={5}
          value={unos.opis}
          maxLength={MAX_OPIS}
          placeholder="Šta ste primijetili, od kada, koliko je veliko… (bez imena ljudi i kućnih brojeva)"
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
        <label htmlFor="kategorija">Kategorija *</label>
        <PrijedlogKategorije
          naslov={unos.naslov}
          opis={unos.opis}
          odabrana={unos.kategorija}
          prihvati={(k) => promijeni('kategorija', k)}
        />
        <select
          id="kategorija"
          value={unos.kategorija}
          onChange={(e) => promijeni('kategorija', e.target.value)}
          aria-invalid={Boolean(greske.kategorija)}
          aria-describedby="kategorija-greska"
        >
          <option value="">– Odaberite kategoriju –</option>
          {KATEGORIJE.map((k) => (
            <option key={k.kljuc} value={k.kljuc}>
              {k.naziv}
            </option>
          ))}
        </select>
        <Greska id="kategorija-greska" poruka={greske.kategorija} />
      </div>

      <PoljeFotografije {...fotografija} />
    </>
  )
}
