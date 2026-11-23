// Zajednički raspored svih ekrana: zaglavlje, sadržaj, podnožje
// i donja navigacija (samo na mobitelu).

import { Outlet } from 'react-router-dom'
import Zaglavlje from './Zaglavlje.jsx'
import Podnozje from './Podnozje.jsx'
import { DonjaNavigacija } from './Navigacija.jsx'
import NaVrhPriPromjeni from './NaVrhPriPromjeni.jsx'

export default function Raspored() {
  return (
    <>
      <NaVrhPriPromjeni />
      <a className="preskoci-link" href="#sadrzaj" onClick={preskociNaSadrzaj}>
        Preskoči na sadržaj
      </a>
      <Zaglavlje />
      <main id="sadrzaj" className="sadrzaj" tabIndex={-1}>
        <Outlet />
      </main>
      <Podnozje />
      <DonjaNavigacija />
    </>
  )
}

// Uz HashRouter "#sadrzaj" bi promijenio rutu, pa fokus pomjeramo ručno.
function preskociNaSadrzaj(dogadjaj) {
  dogadjaj.preventDefault()
  document.getElementById('sadrzaj')?.focus()
}
