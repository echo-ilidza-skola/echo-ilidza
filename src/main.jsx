import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { inicijalizuj } from './data/storage.js'
import 'leaflet/dist/leaflet.css'
// Font Sora (licenca OFL) je dio projekta – ne učitava se s Google servera.
// Samo dvije debljine (600 i 700); svaki fajl sadrži samo latinicu (latin + latin-ext, s č, ć, š, ž, đ),
// a preglednik preuzme latin-ext dio tek kad na stranici zatreba neko od tih slova.
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
// Dizajn-tokeni (boje, sjenke, sjaj, razmaci, fontovi) moraju biti prvi.
import './styles/tokeni.css'
import './styles/global.css'
import './styles/obrazac.css'
import './styles/admin.css'

// Prije prvog prikaza provjeravamo podatke; ako ih nema, učitavaju se testni podaci.
inicijalizuj()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
