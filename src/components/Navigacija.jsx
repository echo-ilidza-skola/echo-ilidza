// Glavna navigacija. Linkovi zavise od demo uloge.
// Ista lista se prikazuje na dva mjesta:
//   - u zaglavlju (tablet i računar),
//   - u donjoj traci (mobitel).

import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useUloga } from '../context/UlogaContext.jsx'
import Ikona from './Ikona.jsx'
import { useJezik } from '../jezik/JezikContext.jsx'
import { predajFotografiju } from './prijava/fotografijaSaKamere.js'

// Nazivi su ključevi u rječniku (src/jezik):
// naziv – puni naziv (zaglavlje na računaru i čitač ekrana)
// kratko – kraći naziv u zaglavlju na užem računaru (960–1199 px)
// mobitel – natpis ispod ikone u donjoj traci na mobitelu (odluka mentorice: "Slikaj" i "Prijave")
const LINKOVI = [
  { putanja: '/', naziv: 'nav.pocetna', kratko: 'nav.pocetna', mobitel: 'nav.pocetna', ikona: 'pocetna', uloge: null },
  { putanja: '/mapa', naziv: 'nav.mapa', kratko: 'nav.mapa', mobitel: 'nav.mapa', ikona: 'mapa', uloge: null },
  { putanja: '/prijavi', naziv: 'nav.prijavi', kratko: 'nav.prijaviKratko', mobitel: 'nav.prijaviMobitel', ikona: 'prijavi', uloge: ['gradjanin'] },
  { putanja: '/moje-prijave', naziv: 'nav.moje', kratko: 'nav.mojeKratko', mobitel: 'nav.mojeMobitel', ikona: 'moje', uloge: ['gradjanin'] },
  { putanja: '/admin', naziv: 'nav.admin', kratko: 'nav.adminKratko', mobitel: 'nav.adminKratko', ikona: 'admin', uloge: ['administrator'] },
  { putanja: '/o-projektu', naziv: 'nav.oProjektu', kratko: 'nav.oProjektu', mobitel: 'nav.oProjektu', ikona: 'info', uloge: null },
]

// Vidljivi linkovi za trenutnu ulogu, s nazivima prevedenim na trenutni jezik.
function useVidljiviLinkovi() {
  const { uloga } = useUloga()
  const { t } = useJezik()
  return LINKOVI.filter((l) => l.uloge === null || l.uloge.includes(uloga)).map((l) => ({
    ...l,
    naziv: t(l.naziv),
    kratko: t(l.kratko),
    mobitel: t(l.mobitel),
  }))
}

// Navigacija u zaglavlju (vidljiva od širine tableta).
export default function Navigacija() {
  const linkovi = useVidljiviLinkovi()
  const { t } = useJezik()
  return (
    <nav className="navigacija" aria-label={t('nav.glavna')}>
      <ul>
        {linkovi.map((link) => (
          <li key={link.putanja}>
            <NavLink to={link.putanja} end={link.putanja === '/'}>
              <Ikona ime={link.ikona} velicina={18} />
              {/* Na užem računaru (960–1199 px) prikazuje se kraća oznaka, da zaglavlje stane u ekran. */}
              <span className="nav-puno">{link.naziv}</span>
              <span className="nav-kratko">{link.kratko}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Okruglo dugme s kamerom u sredini donje trake: odmah otvara kameru telefona
// (polje za fajl s capture="environment"; na računaru se otvori izbor fajla).
// Kad korisnik snimi fotografiju, otvara se "Prijavi problem" s već dodanom fotografijom.
// Ako korisnik zatvori kameru bez fotografije, ništa se ne dešava.
function DugmeKamere({ link }) {
  const navigiraj = useNavigate()
  const { pathname } = useLocation()
  const { t } = useJezik()
  const aktivno = pathname === link.putanja

  function snimljeno(e) {
    const fajl = e.target.files && e.target.files[0]
    e.target.value = '' // da se ista fotografija može ponovo odabrati
    if (!fajl) return
    predajFotografiju(fajl)
    // Novi zapis u historiji (i kad smo već na prijavi), da ekran prijave preuzme fotografiju.
    navigiraj(link.putanja, { state: { saKamere: Date.now() } })
  }

  return (
    <label className={`donje-dugme-kamera${aktivno ? ' active' : ''}`}>
      <span className="kamera-krug">
        <Ikona ime="kamera" velicina={26} />
      </span>
      <span aria-hidden="true">{link.mobitel}</span>
      {/* Čitač ekrana čuje natpis s ekrana i šta dugme radi (npr. "Slikaj – fotografiši problem i prijavi ga"). */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="vizuelno-skriveno"
        aria-label={`${link.mobitel} – ${t('nav.kameraOpis')}`}
        onChange={snimljeno}
      />
    </label>
  )
}

// Donja traka s ikonama (samo na mobitelu).
export function DonjaNavigacija() {
  const linkovi = useVidljiviLinkovi()
  const { t } = useJezik()
  return (
    <nav className="donja-navigacija" aria-label={t('nav.glavnaMobitel')}>
      <ul>
        {linkovi.map((link) => {
          // "Prijavi" je istaknuto okruglo dugme s kamerom u sredini trake (najbrži put do nove prijave).
          if (link.putanja === '/prijavi') {
            return (
              <li key={link.putanja} className="donja-stavka-istaknuta">
                <DugmeKamere link={link} />
              </li>
            )
          }
          return (
            <li key={link.putanja}>
              {/* Čitač ekrana čuje natpis i puni naziv (npr. "Prijave – Moje prijave"); natpis s ekrana
                  mora biti dio imena, da i glasovne komande ("klikni Prijave") rade. */}
              <NavLink
                to={link.putanja}
                end={link.putanja === '/'}
                aria-label={link.mobitel !== link.naziv ? `${link.mobitel} – ${link.naziv}` : undefined}
              >
                <Ikona ime={link.ikona} velicina={22} />
                <span>{link.mobitel}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
