import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { inicijalizuj } from './data/storage.js'
import 'leaflet/dist/leaflet.css'
// Font Montserrat (licenca OFL) je dio projekta – ne učitava se s Google servera.
// Samo latinica s našim slovima (č, ć, š, ž, đ) i dvije debljine: 800 za naslove, 900 za baner.
import '@fontsource/montserrat/latin-800.css'
import '@fontsource/montserrat/latin-ext-800.css'
import '@fontsource/montserrat/latin-900.css'
import '@fontsource/montserrat/latin-ext-900.css'
import './styles/global.css'
import './styles/obrazac.css'

// Prije prvog prikaza provjeravamo podatke; ako ih nema, učitavaju se testni podaci.
inicijalizuj()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
