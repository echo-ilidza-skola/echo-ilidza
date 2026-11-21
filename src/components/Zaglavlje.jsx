import { Link } from 'react-router-dom'
import PrekidacUloge from './PrekidacUloge.jsx'
import Navigacija from './Navigacija.jsx'

export default function Zaglavlje() {
  return (
    <header className="zaglavlje">
      <div className="zaglavlje-vrh">
        <Link to="/" className="logo">
          <span className="logo-naziv">ECHO Civic – Ilidža</span>
          <span className="logo-podnaslov">Glas građana koji se čuje</span>
        </Link>
        <PrekidacUloge />
      </div>
      <Navigacija />
    </header>
  )
}
