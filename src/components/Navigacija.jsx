// Glavna navigacija. Linkovi zavise od demo uloge.

import { NavLink } from 'react-router-dom'
import { useUloga } from '../context/UlogaContext.jsx'

const LINKOVI = [
  { putanja: '/', naziv: 'Početna', uloge: null },
  { putanja: '/mapa', naziv: 'Mapa', uloge: null },
  { putanja: '/prijavi', naziv: 'Prijavi problem', uloge: ['gradjanin'] },
  { putanja: '/moje-prijave', naziv: 'Moje prijave', uloge: ['gradjanin'] },
  { putanja: '/admin', naziv: 'Administracija', uloge: ['administrator'] },
  { putanja: '/o-projektu', naziv: 'O projektu', uloge: null },
]

export default function Navigacija() {
  const { uloga } = useUloga()
  const vidljivi = LINKOVI.filter((l) => l.uloge === null || l.uloge.includes(uloga))

  return (
    <nav className="navigacija" aria-label="Glavna navigacija">
      <ul>
        {vidljivi.map((link) => (
          <li key={link.putanja}>
            <NavLink to={link.putanja} end={link.putanja === '/'}>
              {link.naziv}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
