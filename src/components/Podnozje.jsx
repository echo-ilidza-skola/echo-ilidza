// Podnožje: napomena o prototipu i obavezna atribucija fotografije (CC BY 3.0).
// Nema grba Općine ni linkova na društvene mreže.

import { ZvucniTalas } from './Logo.jsx'

export default function Podnozje() {
  return (
    <footer className="podnozje">
      <div className="podnozje-sadrzaj">
        <p className="podnozje-naziv">
          <ZvucniTalas sirina={34} className="logo-talas" />
          ECHO Civic – Ilidža
        </p>
        <p>
          Školski prototip. Svi podaci su testni i čuvaju se samo u ovom pregledniku. Aplikacija ne šalje
          ništa Općini ni bilo kojoj instituciji.
        </p>
        <p className="podnozje-atribucija">
          Fotografija u zaglavlju početne stranice: Petr Kraumann,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Ilid%C5%BEa.jpg">Wikimedia Commons</a>, licenca{' '}
          <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
        </p>
      </div>
    </footer>
  )
}
