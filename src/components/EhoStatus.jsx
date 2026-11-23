// Status prijave kao EHO (isti motiv kao logo): tačka i do 4 luka.
//   Na čekanju provjere: siva tačka s isprekidanim obrisom, bez lukova.
//   Zaprimljeno 1 luk, U obradi 2, Proslijeđeno službi (simulacija) 3, Riješeno sva 4 i mala kvačica.
//   Odbijeno: siva tačka s malim x, bez lukova.
// Status se nikad ne prikazuje samo crtežom: komponenta ima aria-label, a uz nju se uvijek piše naziv.
//
//   velicina – visina u pikselima (npr. 26 u listama, 72 u detaljima)
//   animacija – 'ne' (liste), 'pri-prikazu' (detalji) ili 'pri-promjeni' (administrator promijeni status):
//               upaljeni lukovi se pale jedan za drugim, jednom, ukupno ispod 0,8 s.

import { useEffect, useRef, useState } from 'react'
import { BROJ_LUKOVA, ehoZaStatus, opisEha } from '../logic/ehoStatus.js'

const TACKA = { x: 9, y: 16 }
const POLUPRECNICI = [7, 12, 17, 22]
const UGAO = (42 * Math.PI) / 180

// Luk oko tačke (dio kruga od -42° do +42°, otvoren udesno).
function putanjaLuka(r) {
  const x = TACKA.x + r * Math.cos(UGAO)
  const dy = r * Math.sin(UGAO)
  return `M${x.toFixed(2)} ${(TACKA.y - dy).toFixed(2)} A${r} ${r} 0 0 1 ${x.toFixed(2)} ${(TACKA.y + dy).toFixed(2)}`
}

// Kad se status promijeni (npr. administrator ga promijeni), animacija se pokrene ponovo.
function useKljucAnimacije(status, animacija) {
  const prethodni = useRef(status)
  const [kljuc, postaviKljuc] = useState(0)
  const [animiraj, postaviAnimiraj] = useState(animacija === 'pri-prikazu')
  useEffect(() => {
    if (prethodni.current !== status) {
      prethodni.current = status
      if (animacija !== 'ne') {
        postaviAnimiraj(true)
        postaviKljuc((k) => k + 1)
      }
    }
  }, [status, animacija])
  return [kljuc, animiraj]
}

export default function EhoStatus({ status, velicina = 26, animacija = 'ne', className = '' }) {
  const { upaljeno, naCekanju, odbijeno, rijeseno } = ehoZaStatus(status)
  const [kljuc, animiraj] = useKljucAnimacije(status, animacija)
  const bezLukova = naCekanju || odbijeno

  return (
    <svg
      key={kljuc}
      className={`eho-status ${animiraj ? 'eho-status--animiraj' : ''} ${className}`}
      viewBox="0 0 34 32"
      width={(velicina * 34) / 32}
      height={velicina}
      role="img"
      aria-label={opisEha(status)}
    >
      {!bezLukova &&
        POLUPRECNICI.slice(0, BROJ_LUKOVA).map((r, i) => (
          <path
            key={r}
            d={putanjaLuka(r)}
            className={i < upaljeno ? 'eho-status-luk eho-status-luk--upaljen' : 'eho-status-luk'}
            style={{ '--i': i }}
          />
        ))}

      {naCekanju && <circle cx={TACKA.x} cy={TACKA.y} r="6.5" className="eho-status-obris" />}
      <circle
        cx={TACKA.x}
        cy={TACKA.y}
        r={odbijeno ? 5.5 : 3.6}
        className={bezLukova ? 'eho-status-tacka eho-status-tacka--siva' : 'eho-status-tacka'}
      />
      {odbijeno && <path d="M6.9 13.9l4.2 4.2M11.1 13.9l-4.2 4.2" className="eho-status-x" />}

      {rijeseno && (
        <g className="eho-status-kvacica">
          <circle cx="28" cy="26" r="5" />
          <path d="M25.7 26.1l1.6 1.6 3-3.3" />
        </g>
      )}
    </svg>
  )
}
