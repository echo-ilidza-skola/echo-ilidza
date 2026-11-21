import { Link } from 'react-router-dom'
import HeroSignali from '../components/HeroSignali.jsx'
import Ikona from '../components/Ikona.jsx'
import Talas from '../components/Talas.jsx'
import { ZvucniTalas } from '../components/Logo.jsx'
import StatistikaTraka from '../components/pocetna/StatistikaTraka.jsx'
import KakoFunkcionise from '../components/pocetna/KakoFunkcionise.jsx'
import MiniMapaGlasova from '../components/pocetna/MiniMapaGlasova.jsx'
import PosljednjePrijave from '../components/pocetna/PosljednjePrijave.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { javnePrijave } from '../data/storage.js'
import { HERO } from '../data/tekstovi.js'
import heroSlika from '../assets/hero-ilidza.jpg'

export default function Pocetna() {
  const javne = usePodaci(javnePrijave)

  return (
    <>
      <section className="hero puna-sirina" aria-labelledby="hero-naslov">
        {/* Fotografija je samo ukras, pa ima prazan alt. Autor i licenca su u podnožju. */}
        <img className="hero-slika" src={heroSlika} alt="" />
        <HeroSignali />

        <div className="hero-sadrzaj">
          <div className="hero-tekst">
            <h1 id="hero-naslov" className="hero-naslov">
              {HERO.naslovPrviRed}
              <span className="hero-naslov-isticanje">{HERO.naslovDrugiRed}</span>
            </h1>
            <p className="hero-poruka">{HERO.poruka}</p>

            <div className="hero-dugmad">
              <Link to="/prijavi" className="dugme dugme-glavno dugme-veliko dugme-sjaj">
                <Ikona ime="prijavi" velicina={20} />
                {HERO.dugme}
                <Ikona ime="strelica" velicina={20} />
              </Link>
              <Link to="/mapa" className="dugme dugme-obrub-svijetlo dugme-veliko">
                <Ikona ime="mapa" velicina={20} />
                {HERO.sporednoDugme}
              </Link>
            </div>

            <p className="hero-koraci">
              <ZvucniTalas sirina={40} className="logo-talas" />
              {HERO.koraci}
            </p>
            <p className="hero-napomena">{HERO.napomena}</p>
          </div>

          <StatistikaTraka javne={javne} />
        </div>

        <Talas boja="var(--podloga)" className="hero-talas" />
      </section>

      <div className="pocetna-mreza">
        <KakoFunkcionise />
        <MiniMapaGlasova javne={javne} />
        <PosljednjePrijave javne={javne} />
      </div>
    </>
  )
}
