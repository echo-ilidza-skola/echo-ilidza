// Korak 3: pregled svih podataka, mogući duplikati i slanje.

import { Link } from 'react-router-dom'
import KategorijaOznaka from '../KategorijaOznaka.jsx'
import StatusOznaka from '../StatusOznaka.jsx'
import Ikona from '../Ikona.jsx'
import { najblizeNaselje } from '../../logic/lokacija.js'
import { upozorenjeLokacije } from '../../logic/validacija.js'
import { PRAG_DUPLIKATA_M } from '../../data/konstante.js'
import { useJezik } from '../../jezik/JezikContext.jsx'


function MoguciDuplikati({ duplikati, posalji, salje }) {
  const { t } = useJezik()
  return (
    <section className="duplikati-okvir" aria-labelledby="duplikati-naslov">
      <h3 id="duplikati-naslov">{t('duplikati.naslov')}</h3>
      <p>{t('duplikati.uputa')}</p>
      <ul className="duplikati-lista">
        {duplikati.map(({ prijava, udaljenostM }) => (
          <li key={prijava.id}>
            <div>
              <Link to={`/prijava/${prijava.id}`} target="_blank" rel="noreferrer">
                {prijava.naslov}
              </Link>
              <p className="duplikati-detalji">
                <StatusOznaka status={prijava.status} />
                <span>{t('duplikati.udaljeno', { m: Math.round(udaljenostM) })}</span>
                <span>{t('duplikati.prijavitelja', { broj: prijava.brojPrijavitelja })}</span>
              </p>
            </div>
            <button type="button" className="dugme dugme-glavno" disabled={salje} onClick={() => posalji(prijava.id)}>
              {t('duplikati.potvrdi')}
            </button>
          </li>
        ))}
      </ul>
      <p className="prigusen mali-tekst">
        {t('duplikati.napomena', { m: PRAG_DUPLIKATA_M })}
      </p>
    </section>
  )
}

export default function KorakPregled({ unos, lokacija, foto, ukloniFoto, duplikati, idiNaKorak, posalji, salje, greska }) {
  const { jezik, t } = useJezik()
  const upozorenje = upozorenjeLokacije(lokacija, jezik)

  return (
    <>
      <dl className="pregled-polja">
        <dt>{t('pregled.naslov')}</dt>
        <dd>{unos.naslov.trim()}</dd>
        <dt>{t('pregled.opis')}</dt>
        <dd className="opis-tekst">{unos.opis.trim()}</dd>
        <dt>{t('pregled.kategorija')}</dt>
        <dd>
          <KategorijaOznaka kategorija={unos.kategorija} />
        </dd>
        <dt>{t('pregled.lokacija')}</dt>
        <dd>
          {t('pregled.priblizno', { naselje: najblizeNaselje(lokacija) })} ({lokacija.lat.toFixed(5)}, {lokacija.lng.toFixed(5)})
          {upozorenje && <span className="upozorenje-okvir upozorenje-u-redu">{upozorenje}</span>}
        </dd>
        <dt>{t('pregled.fotografija')}</dt>
        <dd>
          {foto ? (
            <div className="foto-pregled">
              <img src={foto.url} alt={t('pregled.fotoAlt')} />
              <button type="button" className="dugme dugme-upozorenje" onClick={ukloniFoto} disabled={salje}>
                <Ikona ime="zatvori" velicina={18} />
                {t('obrazacFoto.ukloni')}
              </button>
            </div>
          ) : (
            t('pregled.bezFoto')
          )}
        </dd>
      </dl>

      <p className="pregled-uredi">
        <button type="button" className="link-dugme" onClick={() => idiNaKorak(1)}>
          {t('pregled.urediOpis')}
        </button>
        <button type="button" className="link-dugme" onClick={() => idiNaKorak(2)}>
          {t('pregled.urediLokaciju')}
        </button>
      </p>

      <p className="napomena-javnost">
        <Ikona ime="admin" velicina={20} />
        {t('obrazac.napomenaJavnost')}
      </p>

      {duplikati.length > 0 && <MoguciDuplikati duplikati={duplikati} posalji={posalji} salje={salje} />}

      {greska && (
        <p className="greska-polja" role="alert">
          {greska}
        </p>
      )}

      <div className="obrazac-dugmad">
        <button type="button" className="dugme" onClick={() => idiNaKorak(2)} disabled={salje}>
          {t('obrazac.nazad')}
        </button>
        <button type="button" className="dugme dugme-glavno dugme-veliko" onClick={() => posalji(null)} disabled={salje}>
          <Ikona ime="prijavi" velicina={20} />
          {salje ? t('pregled.saljem') : duplikati.length > 0 ? t('pregled.posaljiNovu') : t('pregled.posalji')}
        </button>
      </div>
    </>
  )
}
