// Logo: simbol zvučnog talasa (eho) + "ECHO" i ispod "CIVIC · ILIDŽA".
// Nikad ne koristimo grb ni znak Općine.

export function ZvucniTalas({ sirina = 44, className }) {
  return (
    <svg
      className={className}
      width={sirina}
      height={sirina * 0.6}
      viewBox="0 0 50 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 15h7l3-6 4 14 4-21 4 26 4-19 3 11 3-5h14" />
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="logo">
      <ZvucniTalas className="logo-talas" />
      <span className="logo-tekst">
        <span className="logo-naziv">ECHO</span>
        <span className="logo-podnaslov">Civic · Ilidža</span>
      </span>
    </span>
  )
}
