// Prijedlog kategorije na osnovu ključnih riječi. Korisnik ga prihvata ili bira drugu kategoriju.
// Ovo su PRAVILA (traženje riječi), NE umjetna inteligencija.

import { kategorijaPoKljucu } from '../../data/konstante.js'
import { predloziKategoriju } from '../../logic/prijedlogKategorije.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

// U interfejsu uvijek piše "Prijedlog na osnovu ključnih riječi (pravila, ne AI)" – rječnik: pravila.oznaka.

export default function PrijedlogKategorije({ naslov, opis, odabrana, prihvati }) {
  const imaTeksta = (naslov + opis).trim().length > 0
  const { t } = useJezik()
  const { kategorija, pogoci } = predloziKategoriju(naslov, opis)
  const predlozena = kategorijaPoKljucu(kategorija)

  return (
    <div className="prijedlog-okvir" aria-live="polite">
      <p className="prijedlog-oznaka">{t('pravila.oznaka')}</p>
      {!imaTeksta && <p className="prijedlog-tekst">{t('pravila.napisite')}</p>}
      {imaTeksta && !predlozena && (
        <p className="prijedlog-tekst">{t('pravila.nema')}</p>
      )}
      {predlozena && (
        <div className="prijedlog-red">
          <p className="prijedlog-tekst">
            <span className="kategorija-tacka" style={{ background: predlozena.boja }} aria-hidden="true" />
            <strong>{t(`kategorije.${predlozena.kljuc}`)}</strong>
            <span className="prigusen">{t('pravila.rijeci', { rijeci: pogoci[0].rijeci.join(', ') })}</span>
          </p>
          {odabrana === kategorija ? (
            <span className="prijedlog-prihvacen">{t('pravila.prihvacen')}</span>
          ) : (
            <button type="button" className="dugme dugme-sporedno dugme-malo" onClick={() => prihvati(kategorija)}>
              {t('pravila.prihvati')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
