import { HashRouter, Routes, Route } from 'react-router-dom'
import { UlogaProvider } from './context/UlogaContext.jsx'
import Raspored from './components/Raspored.jsx'
import ZasticenaRuta from './components/ZasticenaRuta.jsx'
import Pocetna from './pages/Pocetna.jsx'
import Mapa from './pages/Mapa.jsx'
import DetaljiPrijave from './pages/DetaljiPrijave.jsx'
import PrijaviProblem from './pages/PrijaviProblem.jsx'
import MojePrijave from './pages/MojePrijave.jsx'
import Administracija from './pages/admin/Administracija.jsx'
import OProjektu from './pages/OProjektu.jsx'
import NijePronadjeno from './pages/NijePronadjeno.jsx'

// HashRouter koristimo zato što GitHub Pages ne zna za naše rute;
// adrese izgledaju ovako: .../#/mapa
export default function App() {
  return (
    <UlogaProvider>
      <HashRouter>
        <Routes>
          <Route element={<Raspored />}>
            <Route index element={<Pocetna />} />
            <Route path="mapa" element={<Mapa />} />
            <Route path="prijava/:id" element={<DetaljiPrijave />} />
            <Route
              path="prijavi"
              element={
                <ZasticenaRuta uloge={['gradjanin']} naslov="Prijavi problem">
                  <PrijaviProblem />
                </ZasticenaRuta>
              }
            />
            <Route
              path="moje-prijave"
              element={
                <ZasticenaRuta uloge={['gradjanin']} naslov="Moje prijave">
                  <MojePrijave />
                </ZasticenaRuta>
              }
            />
            <Route
              path="admin"
              element={
                <ZasticenaRuta uloge={['administrator']} naslov="Administracija">
                  <Administracija />
                </ZasticenaRuta>
              }
            />
            <Route path="o-projektu" element={<OProjektu />} />
            <Route path="*" element={<NijePronadjeno />} />
          </Route>
        </Routes>
      </HashRouter>
    </UlogaProvider>
  )
}
