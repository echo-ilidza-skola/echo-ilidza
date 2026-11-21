import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { inicijalizuj } from './data/storage.js'
import 'leaflet/dist/leaflet.css'
import './styles/global.css'

// Prije prvog prikaza provjeravamo podatke; ako ih nema, učitavaju se testni podaci.
inicijalizuj()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
