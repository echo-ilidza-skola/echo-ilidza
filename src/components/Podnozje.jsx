// Podnožje: napomena o prototipu i obavezna atribucija fotografije (CC BY 3.0).
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
            Fotografija na početnoj stranici: Petr Kraumann,{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Ilid%C5%BEa.jpg">Wikimedia Commons</a>, licenca{' '}
            <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
          </p>
        </div>
      </div>
    </footer>
  )
}
