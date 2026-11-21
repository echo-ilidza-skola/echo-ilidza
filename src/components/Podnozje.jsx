// Podnožje: napomena o prototipu i obavezna oznaka da je slika na početnoj generisana pomoću AI.
// Nema grba Općine ni linkova na društvene mreže.

import Logo from './Logo.jsx'
import Talas from './Talas.jsx'
import { HERO } from '../data/tekstovi.js'

export default function Podnozje() {
  return (
    <footer className="podnozje">
      <Talas boja="var(--tamna)" className="podnozje-talas" />
      <div className="podnozje-sadrzaj">
        <div className="podnozje-red">
          <Logo />
          <p className="podnozje-slogan">{HERO.koraci}</p>
        </div>
        <div className="podnozje-napomene">
          <p>
            Školski prototip. Svi podaci su testni i čuvaju se samo u ovom pregledniku. Aplikacija ne šalje
            ništa Općini ni bilo kojoj instituciji.
          </p>
          <p className="podnozje-atribucija">
            Slika na početnoj stranici je ilustracija generisana pomoću AI, a ne stvarna fotografija Ilidže.
          </p>
        </div>
      </div>
    </footer>
  )
}
