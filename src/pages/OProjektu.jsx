// O projektu: šta je ECHO, šta je prototip, pravila naspram AI, demo uloge, gdje su podaci, kada radi GPS.
// Ograničenja se navode otvoreno (pravilo 11). Sam tekst (na bosanskom i engleskom) je u OProjektuSadrzaj.jsx.

import { Link } from 'react-router-dom'
import Ikona from '../components/Ikona.jsx'
import TrakaStranice from '../components/TrakaStranice.jsx'
import { useJezik } from '../jezik/JezikContext.jsx'
import { sadrzajOProjektu } from './OProjektuSadrzaj.jsx'

function Odjeljak({ ikona, naslov, children }) {
  return (
    <section className="projekat-odjeljak">
      <h2>
        <span className="projekat-ikona" aria-hidden="true">
          <Ikona ime={ikona} velicina={22} />
        </span>
        {naslov}
      </h2>
      {children}
    </section>
  )
}

export default function OProjektu() {
  const { jezik } = useJezik()
  const sadrzaj = sadrzajOProjektu(jezik)

  return (
    <>
      <TrakaStranice naslov={sadrzaj.naslov} />
      <article className="o-projektu">
        <header className="projekat-uvod">
          <p className="uvod">{sadrzaj.uvod}</p>
        </header>

        {sadrzaj.odjeljci.map((o) => (
          <Odjeljak key={o.naslov} ikona={o.ikona} naslov={o.naslov}>
            {o.tijelo}
          </Odjeljak>
        ))}

        <p className="projekat-kraj">
          <Link to="/mapa" className="dugme dugme-glavno">
            <Ikona ime="mapa" velicina={18} />
            {sadrzaj.dugme}
          </Link>
        </p>
      </article>
    </>
  )
}
