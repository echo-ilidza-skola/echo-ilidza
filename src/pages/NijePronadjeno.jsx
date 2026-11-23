import { Link } from 'react-router-dom'
import TrakaStranice from '../components/TrakaStranice.jsx'

export default function NijePronadjeno() {
  return (
    <>
      <TrakaStranice naslov="Stranica nije pronađena" />
      <section>
        <p>
          Ova adresa ne postoji. <Link to="/">Vratite se na početnu stranicu.</Link>
        </p>
      </section>
    </>
  )
}
