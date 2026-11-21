// Korak 3: pregled svih podataka, mogući duplikati i slanje.

import { Link } from 'react-router-dom'
import KategorijaOznaka from '../KategorijaOznaka.jsx'
import StatusOznaka from '../StatusOznaka.jsx'
import Ikona from '../Ikona.jsx'
import { najblizeNaselje } from '../../logic/lokacija.js'
import { upozorenjeLokacije } from '../../logic/validacija.js'

export const NAPOMENA_JAVNOST = 'Prijava i fotografija postaju javne tek nakon provjere administratora.'

function MoguciDuplikati({ duplikati, posalji, salje }) {
  return (
    <section className="duplikati-okvir" aria-labelledby="duplikati-naslov">
      <h3 id="duplikati-naslov">Ovaj problem je možda već prijavljen.</h3>
      <p>Potvrdite istu prijavu ili pošaljite novu.</p>
      <ul className="duplikati-lista">
        {duplikati.map(({ prijava, udaljenostM }) => (
          <li key={prijava.id}>
            <div>
              <Link to={`/prijava/${prijava.id}`} target="_blank" rel="noreferrer">
                {prijava.naslov}
              </Link>
              <p className="duplikati-detalji">
                <StatusOznaka status={prijava.status} />
                <span>udaljeno oko {Math.round(udaljenostM)} m</span>
                <span>prijavitelja: {prijava.brojPrijavitelja}</span>
              </p>
            </div>
            <button type="button" className="dugme dugme-glavno" disabled={salje} onClick={() => posalji(prijava.id)}>
              Ovo je isti problem – potvrdi
            </button>
          </li>
        ))}
      </ul>
      <p className="prigusen mali-tekst">
        Sistem samo predlaže moguće duplikate (ista kategorija, manje od 50 m). Ništa se ne povezuje bez vaše potvrde.
      </p>
    </section>
  )
}

export default function KorakPregled({ unos, lokacija, foto, ukloniFoto, duplikati, idiNaKorak, posalji, salje, greska }) {
  const upozorenje = upozorenjeLokacije(lokacija)

  return (
    <>
      <dl className="pregled-polja">
        <dt>Naslov</dt>
        <dd>{unos.naslov.trim()}</dd>
        <dt>Opis</dt>
        <dd className="opis-tekst">{unos.opis.trim()}</dd>
        <dt>Kategorija</dt>
        <dd>
          <KategorijaOznaka kategorija={unos.kategorija} />
        </dd>
        <dt>Lokacija</dt>
        <dd>
          Približno naselje {najblizeNaselje(lokacija)} ({lokacija.lat.toFixed(5)}, {lokacija.lng.toFixed(5)})
          {upozorenje && <span className="upozorenje-okvir upozorenje-u-redu">{upozorenje}</span>}
        </dd>
        <dt>Fotografija</dt>
        <dd>
          {foto ? (
            <div className="foto-pregled">
              <img src={foto.url} alt="Fotografija koja će biti poslana uz prijavu" />
              <button type="button" className="dugme dugme-upozorenje" onClick={ukloniFoto} disabled={salje}>
                <Ikona ime="zatvori" velicina={18} />
                Ukloni fotografiju
              </button>
            </div>
          ) : (
            'Bez fotografije'
          )}
        </dd>
      </dl>

      <p className="pregled-uredi">
        <button type="button" className="link-dugme" onClick={() => idiNaKorak(1)}>
          Uredi opis
        </button>
        <button type="button" className="link-dugme" onClick={() => idiNaKorak(2)}>
          Uredi lokaciju
        </button>
      </p>

      <p className="napomena-javnost">
        <Ikona ime="admin" velicina={20} />
        {NAPOMENA_JAVNOST}
      </p>

      {duplikati.length > 0 && <MoguciDuplikati duplikati={duplikati} posalji={posalji} salje={salje} />}

      {greska && (
        <p className="greska-polja" role="alert">
          {greska}
        </p>
      )}

      <div className="obrazac-dugmad">
        <button type="button" className="dugme" onClick={() => idiNaKorak(2)} disabled={salje}>
          Nazad
        </button>
        <button type="button" className="dugme dugme-glavno dugme-veliko" onClick={() => posalji(null)} disabled={salje}>
          <Ikona ime="prijavi" velicina={20} />
          {salje ? 'Šaljem…' : duplikati.length > 0 ? 'Pošalji kao novu prijavu' : 'Pošalji prijavu'}
        </button>
      </div>
    </>
  )
}
