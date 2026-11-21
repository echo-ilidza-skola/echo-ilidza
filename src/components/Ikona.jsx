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
  osoba: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4.5 20.5c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5'],
  poruka: ['M4 5h16v11H9l-5 4z', 'M8 9.5h8', 'M8 12.5h5'],
  kvacica: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'm8 12.3 2.8 2.7L16.5 9.5'],
  sat: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7.5V12l3 2'],

  // Ikone kategorija (neutralne; testne prijave nemaju fotografija).
  ceste: ['M8 3 4 21', 'M16 3l4 18', 'M12 4v3', 'M12 10.5v3', 'M12 17v3'],
  rasvjeta: ['M9.5 18h5', 'M10.5 21h3', 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'],
  otpad: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13', 'M10 11v5.5', 'M14 11v5.5'],
  igralista: ['M12 3l5 7h-3l4 6H6l4-6H7z', 'M12 16v5'],
  prevoz: ['M6 4h12a2 2 0 0 1 2 2v10H4V6a2 2 0 0 1 2-2z', 'M4 11h16', 'M7 16v3', 'M17 16v3', 'M8 13.5h.01', 'M16 13.5h.01'],
  sigurnost: ['M12 3.5 2.5 20h19z', 'M12 9.5v4.5', 'M12 17h.01'],
  infrastruktura: ['M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z'],
  okolis: ['M5 19C5 11 11 5 20 5c0 9-6 15-14 15', 'M5 19c3-4 6-7 10-9'],
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
