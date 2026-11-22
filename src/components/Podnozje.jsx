// Podnožje: logo, slogan i napomena o prototipu. Izvori slika su navedeni na ekranu O projektu.
// Nema grba Općine ni linkova na društvene mreže.

import Logo from './Logo.jsx'
import Talas from './Talas.jsx'

export default function Podnozje() {
  return (
    <footer className="podnozje">
      <Talas boja="var(--tamna)" className="podnozje-talas" />
      <div className="podnozje-sadrzaj">
        <div className="podnozje-red">
          <Logo />
          <p className="podnozje-slogan">Pametniji grad. Aktivniji građani.</p>
        </div>
        <div className="podnozje-napomene">
          <p>
            Školski prototip. Svi podaci su testni i čuvaju se samo u ovom pregledniku. Aplikacija ne šalje
            ništa Općini ni bilo kojoj instituciji.
          </p>
        </div>
      </div>
    </footer>
  )
}
