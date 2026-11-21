// Traka napretka statusa: Na čekanju → Zaprimljeno → U obradi → Proslijeđeno (simulacija) → Riješeno.
// Prikazuje i vrijeme svakog koraka. Odbijena prijava ima dva koraka: Na čekanju → Odbijeno.

import { koraciNapretka, procenatNapretka } from '../logic/napredak.js'
import { formatirajDatum } from '../logic/datum.js'

export default function TrakaNapretka({ prijava }) {
  const koraci = koraciNapretka(prijava)
  const odbijena = prijava.status === 'ODBIJENO'

  return (
    <div className={`traka-napretka ${odbijena ? 'traka-napretka--odbijena' : ''}`}>
      {/* Linija iza tačaka; obojeni dio pokazuje koliko je puta pređeno. */}
      <div className="traka-napretka-linija" aria-hidden="true">
        <span style={{ width: `${procenatNapretka(prijava)}%` }} />
      </div>
      <ol className="traka-napretka-koraci" style={{ '--broj-koraka': koraci.length }}>
        {koraci.map((k) => (
          <li
            key={k.status}
            className={`napredak-korak napredak-korak--${k.stanje}`}
            aria-current={k.stanje === 'trenutni' ? 'step' : undefined}
          >
            <span className="napredak-tacka" aria-hidden="true" />
            <span className="napredak-naziv">
              {k.naziv}
              {/* Za čitač ekrana: da li je korak prošao, trenutni ili tek dolazi. */}
              <span className="vizuelno-skriveno">
                {k.stanje === 'gotov' && ' (završeno)'}
                {k.stanje === 'trenutni' && ' (trenutni status)'}
                {k.stanje === 'buduci' && ' (još nije)'}
              </span>
            </span>
            {k.datum && <span className="napredak-datum">{formatirajDatum(k.datum)}</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}
