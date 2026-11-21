import { Link } from 'react-router-dom'
import PrekidacUloge from './PrekidacUloge.jsx'
import Navigacija from './Navigacija.jsx'
import Logo from './Logo.jsx'

export default function Zaglavlje() {
  return (
    <header className="zaglavlje">
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
