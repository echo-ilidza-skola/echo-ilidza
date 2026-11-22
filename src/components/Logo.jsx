// Logo: ZNAK EHA (izvor glasa + tri luka koji se šire) i ispod natpis "ILIDŽA".
// Ideja: građanin pošalje glas (tačka), a on se širi i vraća kao odjek (luci).
// Nikad ne koristimo grb ni znak Općine.

// Luci su dijelovi kružnica oko tačke (6, 18), poluprečnika 8, 14 i 20, od -50° do +50°.
const LUCI = [
  'M11.14 11.87 A8 8 0 0 1 11.14 24.13',
  'M15 7.28 A14 14 0 0 1 15 28.72',
  'M18.86 2.68 A20 20 0 0 1 18.86 33.32',
]

// animiran: luci se pale jedan za drugim (odjek), tačka lagano "diše".
export function EhoZnak({ velicina = 36, animiran = true, className = '' }) {
  return (
    <svg
      className={`eho-znak ${animiran ? 'eho-znak--animiran' : ''} ${className}`}
      width={velicina * (30 / 36)}
      height={velicina}
      viewBox="0 0 30 36"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Mekani sjaj iza tačke */}
      <circle className="eho-sjaj" cx="6" cy="18" r="6" />
      <circle className="eho-tacka" cx="6" cy="18" r="3.6" />
      {LUCI.map((d, i) => (
        <path key={d} className={`eho-luk eho-luk-${i + 1}`} d={d} />
      ))}
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="logo">
      <EhoZnak className="logo-znak" />
      <span className="logo-tekst">
        <span className="logo-naziv">ECHO</span>
        <span className="logo-podnaslov">Ilidža</span>
      </span>
    </span>
  )
}
