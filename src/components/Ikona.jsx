// Jednostavne vlastite ikone (inline SVG, bez biblioteke ikona).
// Svaka ikona je lista SVG putanja u kvadratu 24 × 24; boja dolazi iz teksta (currentColor).

const PUTANJE = {
  pocetna: ['M3 11.5 12 4l9 7.5', 'M5.5 10v9.5h5v-5.5h3v5.5h5V10'],
  mapa: ['M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z', 'M12 12.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4z'],
  prijavi: ['M21 3 3 10.5l7.2 2.6L13 21l8-18z', 'M10.2 13.1 21 3'],
  moje: ['M7 3h7.5L19 7.5V21H7z', 'M14.5 3v4.5H19', 'M10 12h6', 'M10 15.5h6'],
  admin: ['M12 3 5 6v5.5c0 4.3 3 7.8 7 9.5 4-1.7 7-5.2 7-9.5V6z', 'm9 12 2.2 2.2L15.5 10'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v6', 'M12 7.5v.01'],
  filter: ['M4 5h16l-6.2 7.4V19l-3.6-1.8v-4.8z'],
  strelica: ['M5 12h14', 'm13 6 6 6-6 6'],
  zatvori: ['M6 6l12 12', 'M18 6 6 18'],
}

export default function Ikona({ ime, velicina = 22, className }) {
  const putanje = PUTANJE[ime]
  if (!putanje) return null
  return (
    <svg
      className={className}
      width={velicina}
      height={velicina}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {putanje.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
