import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PrekidacUloge from './PrekidacUloge.jsx'
import Navigacija from './Navigacija.jsx'
import Logo from './Logo.jsx'

export default function Zaglavlje() {
  const { pathname } = useLocation()
  // Na početnoj stranici zaglavlje je poluprovidno i leži preko slike (kao na mockupu).
  const prekoSlike = pathname === '/'
  const ref = useRef(null)

  // Visinu zaglavlja upisujemo u CSS varijablu, da se slika na početnoj može "podvući" ispod njega.
  useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const posmatrac = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--visina-zaglavlja', `${element.offsetHeight}px`)
    })
    posmatrac.observe(element)
    return () => posmatrac.disconnect()
  }, [])

  return (
    <header ref={ref} className={prekoSlike ? 'zaglavlje zaglavlje--preko-slike' : 'zaglavlje'}>
      <div className="zaglavlje-sadrzaj">
        <Link to="/" className="logo-link" aria-label="ECHO Civic – Ilidža, početna stranica">
          <Logo />
        </Link>
        <Navigacija />
        <PrekidacUloge />
      </div>
    </header>
  )
}
