import { Link } from 'react-router-dom'

export default function NijePronadjeno() {
  return (
    <section>
      <h1>Stranica nije pronađena</h1>
      <p>
        Ova adresa ne postoji. <Link to="/">Vratite se na početnu stranicu.</Link>
      </p>
    </section>
  )
}
