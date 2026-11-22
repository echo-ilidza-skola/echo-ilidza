// Posljednjih 5 ODOBRENIH (javnih) prijava, s fotografijom ako postoji, a inače s ikonom kategorije.

import { Link } from 'react-router-dom'
import Ikona from '../Ikona.jsx'
import MinijaturaPrijave from './MinijaturaPrijave.jsx'
import StatusOznaka from '../StatusOznaka.jsx'
import { kategorijaPoKljucu } from '../../data/konstante.js'
import { posljednjePrijave } from '../../logic/statistika.js'

export default function PosljednjePrijave({ javne }) {
  const prijave = posljednjePrijave(javne, 5)

  return (
    <section className="pocetna-kartica posljednje" aria-labelledby="posljednje-naslov">
      <div className="kartica-zaglavlje">
        <h2 id="posljednje-naslov">Posljednje prijave</h2>
        <Link to="/mapa" className="link-strelica">
          Sve prijave <Ikona ime="strelica" velicina={16} />
        </Link>
      </div>

      {prijave.length === 0 ? (
        <p>Još nema odobrenih prijava.</p>
      ) : (
        <ul className="posljednje-lista">
          {prijave.map((p) => {
            const k = kategorijaPoKljucu(p.kategorija)
            return (
              <li key={p.id}>
                <MinijaturaPrijave prijava={p} boja={k?.boja} />
                <span className="posljednje-tekst">
                  <Link to={`/prijava/${p.id}`} className="posljednje-naslov">
                    {p.naslov}
                  </Link>
                  <span className="posljednje-naselje">
                    <Ikona ime="mapa" velicina={14} />
                    {p.naselje}
                    <span className="vizuelno-skriveno">, kategorija: {k?.naziv}</span>
                  </span>
                </span>
                <StatusOznaka status={p.status} />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
