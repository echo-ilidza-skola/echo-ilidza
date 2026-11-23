// Historija statusa kao vremenska linija eha: tačka (prijava poslana), pa po jedan luk za svaki korak
// (Zaprimljeno, U obradi, Proslijeđeno (simulacija), Riješeno). Upaljeni lukovi su prošli koraci i
// trenutni status; ispod svakog upaljenog koraka je datum (i napomena, ako postoji).
// Odbijena prijava ima dva koraka: tačka → x (Odbijeno).

import { koraciNapretka } from '../logic/napredak.js'
import { formatirajDatum } from '../logic/datum.js'
import { napomenaZaPrikaz } from '../logic/administracija.js'
import { useJezik } from '../jezik/JezikContext.jsx'

// Mali crtež koraka: tačka (početak), luk (koraci 1–4) ili x (odbijeno).
function ZnakKoraka({ redniBroj, stanje, status }) {
  const upaljen = stanje !== 'buduci'
  return (
    <svg className="eho-linija-znak" viewBox="0 0 24 32" width="24" height="32" aria-hidden="true">
      {status === 'ODBIJENO' ? (
        <g className="eho-linija-x">
          <circle cx="12" cy="16" r="7" />
          <path d="M9 13l6 6M15 13l-6 6" />
        </g>
      ) : redniBroj === 0 ? (
        <circle cx="12" cy="16" r="5" className={upaljen ? 'eho-linija-tacka' : 'eho-linija-tacka eho-linija--ugasen'} />
      ) : (
        <path
          d="M8 4.5A14 14 0 0 1 8 27.5"
          className={upaljen ? 'eho-linija-luk' : 'eho-linija-luk eho-linija--ugasen'}
        />
      )}
    </svg>
  )
}

export default function EhoVremenskaLinija({ prijava }) {
  const { jezik, t } = useJezik()
  const koraci = koraciNapretka(prijava, jezik)

  return (
    <ol className="eho-linija" style={{ '--broj-koraka': koraci.length }}>
      {koraci.map((k, i) => (
        <li
          key={k.status}
          className={`eho-linija-korak eho-linija-korak--${k.stanje}`}
          aria-current={k.stanje === 'trenutni' ? 'step' : undefined}
        >
          <ZnakKoraka redniBroj={i} stanje={k.stanje} status={k.status} />
          <span className="eho-linija-naziv">
            {k.naziv}
            {/* Za čitač ekrana: da li je korak prošao, trenutni ili tek dolazi. */}
            <span className="vizuelno-skriveno">
              {k.stanje === 'gotov' && t('linija.zavrseno')}
              {k.stanje === 'trenutni' && t('linija.trenutni')}
              {k.stanje === 'buduci' && t('linija.buduci')}
            </span>
          </span>
          {k.datum && <span className="eho-linija-datum">{formatirajDatum(k.datum, false, jezik)}</span>}
          {k.napomena && <span className="eho-linija-napomena">{napomenaZaPrikaz(k.napomena, jezik)}</span>}
        </li>
      ))}
    </ol>
  )
}
