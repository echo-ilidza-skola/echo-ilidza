import { Link } from 'react-router-dom'
import TrakaStranice from '../components/TrakaStranice.jsx'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function NijePronadjeno() {
  const { t } = useJezik()
  return (
    <>
      <TrakaStranice naslov={t('nijePronadjeno.naslov')} />
      <section>
        <p>
          {t('nijePronadjeno.tekst')} <Link to="/">{t('nijePronadjeno.link')}</Link>
        </p>
      </section>
    </>
  )
}
