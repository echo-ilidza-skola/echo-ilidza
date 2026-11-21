import { Link } from 'react-router-dom'
import HeroSignali from '../components/HeroSignali.jsx'
import Ikona from '../components/Ikona.jsx'
import Talas from '../components/Talas.jsx'
import Pojava from '../components/Pojava.jsx'
import { ZvucniTalas } from '../components/Logo.jsx'
import StatistikaTraka from '../components/pocetna/StatistikaTraka.jsx'
import KakoFunkcionise from '../components/pocetna/KakoFunkcionise.jsx'
import MiniMapaGlasova from '../components/pocetna/MiniMapaGlasova.jsx'
import PosljednjePrijave from '../components/pocetna/PosljednjePrijave.jsx'
import { usePodaci } from '../hooks/usePodaci.js'
import { javnePrijave } from '../data/storage.js'
import { HERO } from '../data/tekstovi.js'
import heroSlika from '../assets/hero-ilidza-ai.jpg'

// Klase "ulaz ulaz-N" pokreću animaciju pojavljivanja jednog elementa za drugim (vidi global.css).
export default function Pocetna() {
  const javne = usePodaci(javnePrijave)

  return (
    <>
      <section className="hero puna-sirina" aria-labelledby="hero-naslov">
        {/* Fotografija je samo ukras, pa ima prazan alt. Autor i licenca su u podnožju. */}
        <div className="hero-slika-okvir">
          <img className="hero-slika" src={heroSlika} alt="" />
        </div>
        <HeroSignali />

        <div className="hero-sadrzaj">
          <div className="hero-tekst">
            <h1 id="hero-naslov" className="hero-naslov">
              <span className="hero-naslov-red ulaz ulaz-1">{HERO.naslovPrviRed}</span>
              <span className="hero-naslov-red hero-naslov-isticanje ulaz ulaz-2">{HERO.naslovDrugiRed}</span>
            </h1>
            <p className="hero-poruka ulaz ulaz-3">{HERO.poruka}</p>

            <div className="hero-dugmad ulaz ulaz-4">
              <Link to="/prijavi" className="dugme dugme-glavno dugme-veliko dugme-sjaj">
                <Ikona ime="prijavi" velicina={20} />
                {HERO.dugme}
                <Ikona ime="strelica" velicina={20} className="ikona-strelica" />
              </Link>
              <Link to="/mapa" className="dugme dugme-obrub-svijetlo dugme-veliko">
                <Ikona ime="mapa" velicina={20} />
                {HERO.sporednoDugme}
              </Link>
            </div>

            <p className="hero-koraci ulaz ulaz-5">
              <ZvucniTalas sirina={40} className="logo-talas talas-puls" />
              {HERO.koraci}
            </p>
            <p className="hero-napomena ulaz ulaz-5">{HERO.napomena}</p>
          </div>

          <StatistikaTraka javne={javne} />
        </div>

        <Talas boja="var(--podloga)" className="hero-talas" />
      </section>

      <div className="pocetna-mreza">
        <Pojava className="mreza-kako">
          <KakoFunkcionise />
        </Pojava>
        <Pojava kasnjenje={0.12}>
          <MiniMapaGlasova javne={javne} />
        </Pojava>
        <Pojava kasnjenje={0.24}>
          <PosljednjePrijave javne={javne} />
        </Pojava>
      </div>
    </>
  )
}
