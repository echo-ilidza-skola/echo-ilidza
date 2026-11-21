// Glavna navigacija. Linkovi zavise od demo uloge.
// Ista lista se prikazuje na dva mjesta:
//   - u zaglavlju (tablet i računar),
//   - u donjoj traci (mobitel).

import { NavLink } from 'react-router-dom'
import { useUloga } from '../context/UlogaContext.jsx'
import Ikona from './Ikona.jsx'

const LINKOVI = [
  { putanja: '/', naziv: 'Početna', kratko: 'Početna', ikona: 'pocetna', uloge: null },
  { putanja: '/mapa', naziv: 'Mapa', kratko: 'Mapa', ikona: 'mapa', uloge: null },
  { putanja: '/prijavi', naziv: 'Prijavi problem', kratko: 'Prijavi', ikona: 'prijavi', uloge: ['gradjanin'] },
  { putanja: '/moje-prijave', naziv: 'Moje prijave', kratko: 'Moje', ikona: 'moje', uloge: ['gradjanin'] },
  { putanja: '/admin', naziv: 'Administracija', kratko: 'Admin', ikona: 'admin', uloge: ['administrator'] },
  { putanja: '/o-projektu', naziv: 'O projektu', kratko: 'O projektu', ikona: 'info', uloge: null },
]

function useVidljiviLinkovi() {
  const { uloga } = useUloga()
  return LINKOVI.filter((l) => l.uloge === null || l.uloge.includes(uloga))
}

// Navigacija u zaglavlju (vidljiva od širine tableta).
export default function Navigacija() {
  const linkovi = useVidljiviLinkovi()
  return (
    <nav className="navigacija" aria-label="Glavna navigacija">
      <ul>
        {linkovi.map((link) => (
          <li key={link.putanja}>
            <NavLink to={link.putanja} end={link.putanja === '/'}>
              <Ikona ime={link.ikona} velicina={18} />
              {link.naziv}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Donja traka s ikonama (samo na mobitelu).
export function DonjaNavigacija() {
  const linkovi = useVidljiviLinkovi()
  return (
    <nav className="donja-navigacija" aria-label="Glavna navigacija (mobitel)">
      <ul>
        {linkovi.map((link) => {
          // "Prijavi" je istaknuto okruglo dugme s kamerom u sredini trake (najbrži put do nove prijave).
          const istaknuto = link.putanja === '/prijavi'
          return (
            <li key={link.putanja} className={istaknuto ? 'donja-stavka-istaknuta' : undefined}>
              <NavLink to={link.putanja} end={link.putanja === '/'} className={istaknuto ? 'donje-dugme-kamera' : undefined}>
                <span className={istaknuto ? 'kamera-krug' : undefined}>
                  <Ikona ime={istaknuto ? 'kamera' : link.ikona} velicina={istaknuto ? 26 : 22} />
                </span>
                <span>{link.kratko}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
