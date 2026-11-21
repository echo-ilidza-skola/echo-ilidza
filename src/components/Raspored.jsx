// Zajednički raspored svih ekrana: traka o testnim podacima, zaglavlje, sadržaj, podnožje.

import { Outlet } from 'react-router-dom'
import TrakaTestniPodaci from './TrakaTestniPodaci.jsx'
import Zaglavlje from './Zaglavlje.jsx'

export default function Raspored() {
  return (
    <>
      <a className="preskoci-link" href="#sadrzaj" onClick={preskociNaSadrzaj}>
        Preskoči na sadržaj
      </a>
      <TrakaTestniPodaci />
      <Zaglavlje />
      <main id="sadrzaj" className="sadrzaj" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="podnozje">
        <p>ECHO Civic – Ilidža · školski prototip · svi podaci su testni i čuvaju se samo u ovom pregledniku.</p>
      </footer>
    </>
  )
}

// Uz HashRouter "#sadrzaj" bi promijenio rutu, pa fokus pomjeramo ručno.
function preskociNaSadrzaj(dogadjaj) {
  dogadjaj.preventDefault()
  document.getElementById('sadrzaj')?.focus()
}
