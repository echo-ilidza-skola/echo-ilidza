// Podnožje: logo, slogan i napomena o prototipu (podnaslov "Glas građana koji se čuje" je samo ispod dugmeta na Početnoj). Izvori slika su navedeni na ekranu O projektu.
// Nema grba Općine ni linkova na društvene mreže.

import Logo from './Logo.jsx'
import Talas from './Talas.jsx'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function Podnozje() {
  const { t } = useJezik()
  return (
    <footer className="podnozje">
      <Talas boja="var(--tamna)" className="podnozje-talas" />
      <div className="podnozje-sadrzaj">
        <div className="podnozje-red">
          <Logo />
          <p className="podnozje-slogan">{t('podnozje.slogan')}</p>
        </div>
        <div className="podnozje-napomene">
          <p>{t('podnozje.napomena')}</p>
        </div>
      </div>
    </footer>
  )
}
