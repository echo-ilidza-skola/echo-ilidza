// Talasasti prelaz između tamnog i svijetlog dijela stranice (samo ukras).
// "boja" je CSS boja donjeg dijela talasa.

export default function Talas({ boja, className, obrnuto = false }) {
  return (
    <svg
      className={`talas ${className || ''}`}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={obrnuto ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path d="M0 48C240 6 480 6 720 34s480 46 720 4V80H0z" fill={boja} />
      <path className="talas-linija" d="M0 48C240 6 480 6 720 34s480 46 720 4" fill="none" />
    </svg>
  )
}
