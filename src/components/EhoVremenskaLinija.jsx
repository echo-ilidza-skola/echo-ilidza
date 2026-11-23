// Historija statusa kao vremenska linija eha: tačka (prijava poslana), pa po jedan luk za svaki korak
// (Zaprimljeno, U obradi, Proslijeđeno (simulacija), Riješeno). Upaljeni lukovi su prošli koraci i
// trenutni status; ispod svakog upaljenog koraka je datum (i napomena, ako postoji).
// Odbijena prijava ima dva koraka: tačka → x (Odbijeno).

import { koraciNapretka } from '../logic/napredak.js'
import { formatirajDatum } from '../logic/datum.js'
import { napomenaZaPrikaz } from '../logic/administracija.js'
import { useJezik } from '../jezik/JezikContext.jsx'
import { TACKA, POLUPRECNICI, putanjaLuka } from './EhoStatus.jsx'

// Mali crtež koraka, kao logo: tačka i onoliko lukova koliko je redni broj koraka
// (Na čekanju samo tačka, Zaprimljeno 1 luk … Riješeno 4 luka). Dostignut korak je upaljen.
// Odbijena prijava: siva tačka s x.
function ZnakKoraka({ redniBroj, stanje, status }) {
  const klasa = stanje === 'buduci' ? 'eho-linija--ugasen' : 'eho-linija--upaljen'
  return (
    <svg className="eho-linija-znak" viewBox="0 0 34 32" width="34" height="32" aria-hidden="true">
      {status === 'ODBIJENO' ? (
        <g className="eho-linija-x">
          <circle cx={TACKA.x} cy={TACKA.y} r="7" />
          <path d={`M${TACKA.x - 3} ${TACKA.y - 3}l6 6M${TACKA.x + 3} ${TACKA.y - 3}l-6 6`} />
        </g>
      ) : (
        <g className={klasa}>
          <circle cx={TACKA.x} cy={TACKA.y} r="4.5" className="eho-linija-tacka" />
          {POLUPRECNICI.slice(0, redniBroj).map((r) => (
            <path key={r} d={putanjaLuka(r)} className="eho-linija-luk" />
          ))}
        </g>
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
