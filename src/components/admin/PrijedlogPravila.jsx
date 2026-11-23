// Prijedlog kategorije i prioriteta (PRAVILA, ne AI) s razlozima, i izbor konačnih vrijednosti.
// Konačnu kategoriju i prioritet potvrđuje administrator; prijedlog pravila ostaje sačuvan.

import { KATEGORIJE, PRIORITETI, kategorijaPoKljucu } from '../../data/konstante.js'
import { predloziPrioritet } from '../../logic/prioritet.js'
import { predloziKategoriju } from '../../logic/prijedlogKategorije.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

// Uz prioritet uvijek piše "Orijentacioni prijedlog, nije procjena stvarne opasnosti." (rječnik: pp.napomena).

export default function PrijedlogPravila({ prijava, kategorija, prioritet, promijeniKategoriju, promijeniPrioritet }) {
  const predlozenaKat = kategorijaPoKljucu(prijava.predlozenaKategorija)
  const pogociKategorije = predloziKategoriju(prijava.naslov, prijava.opis).pogoci
  const { prioritet: predlozeniPr, bodovi, razlozi } = predloziPrioritet(
    prijava.naslov,
    prijava.opis,
    (prijava.brojPrijavitelja || 1) - 1,
  )
  const idPrefiks = `pp-${prijava.id}`
  const { t } = useJezik()

  return (
    <div className="admin-prijedlog">
      <p className="prijedlog-oznaka">{t('pravila.oznaka')}</p>

      <div className="admin-prijedlog-mreza">
        <div>
          <p className="admin-prijedlog-naslov">{t('pp.kategorija')}</p>
          <p className="mali-tekst">
            {t('pp.prijedlogPravila')}{' '}
            <strong>{predlozenaKat ? t(`kategorije.${predlozenaKat.kljuc}`) : t('pp.nemaPrijedloga')}</strong>
            {pogociKategorije.length > 0 && (
              <span className="prigusen">{t('pp.rijeci', { rijeci: pogociKategorije[0].rijeci.join(', ') })}</span>
            )}
          </p>
          <label htmlFor={`${idPrefiks}-kat`} className="mali-tekst">
            {t('pp.konacna')}
          </label>
          <select id={`${idPrefiks}-kat`} value={kategorija} onChange={(e) => promijeniKategoriju(e.target.value)}>
            {KATEGORIJE.map((k) => (
              <option key={k.kljuc} value={k.kljuc}>
                {t(`kategorije.${k.kljuc}`)}
                {k.kljuc === prijava.predlozenaKategorija ? t('pp.oznakaPrijedloga') : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="admin-prijedlog-naslov">{t('pp.prioritet')}</p>
          <p className="mali-tekst">
            {t('pp.prijedlogPravila')} <strong>{t(`prioriteti.${predlozeniPr}`)}</strong> {t('pp.bodova', { bodovi })}
          </p>
          {razlozi.length > 0 ? (
            <ul className="admin-razlozi">
              {razlozi.map((r) => (
                <li key={r.kljuc}>
                  {t(r.kljuc, r.parametri)} <strong>+{r.bodovi}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mali-tekst prigusen">{t('pp.nijedno')}</p>
          )}
          <label htmlFor={`${idPrefiks}-pr`} className="mali-tekst">
            {t('pp.potvrdjeni')}
          </label>
          <select id={`${idPrefiks}-pr`} value={prioritet} onChange={(e) => promijeniPrioritet(e.target.value)}>
            {Object.keys(PRIORITETI).map((kljuc) => (
              <option key={kljuc} value={kljuc}>
                {t(`prioriteti.${kljuc}`)}
                {kljuc === predlozeniPr ? t('pp.oznakaPrijedloga') : ''}
              </option>
            ))}
          </select>
          <p className="mali-tekst prigusen admin-napomena-prioritet">{t('pp.napomena')}</p>
        </div>
      </div>
    </div>
  )
}
