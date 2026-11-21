// Prijedlog kategorije i prioriteta (PRAVILA, ne AI) s razlozima, i izbor konačnih vrijednosti.
// Konačnu kategoriju i prioritet potvrđuje administrator; prijedlog pravila ostaje sačuvan.

import { KATEGORIJE, PRIORITETI, kategorijaPoKljucu } from '../../data/konstante.js'
import { predloziPrioritet } from '../../logic/prioritet.js'
import { predloziKategoriju } from '../../logic/prijedlogKategorije.js'
import { OZNAKA_PRAVILA } from '../prijava/PrijedlogKategorije.jsx'

export const NAPOMENA_PRIORITET = 'Orijentacioni prijedlog, nije procjena stvarne opasnosti.'

export default function PrijedlogPravila({ prijava, kategorija, prioritet, promijeniKategoriju, promijeniPrioritet }) {
  const predlozenaKat = kategorijaPoKljucu(prijava.predlozenaKategorija)
  const pogociKategorije = predloziKategoriju(prijava.naslov, prijava.opis).pogoci
  const { prioritet: predlozeniPr, bodovi, razlozi } = predloziPrioritet(
    prijava.naslov,
    prijava.opis,
    (prijava.brojPrijavitelja || 1) - 1,
  )
  const idPrefiks = `pp-${prijava.id}`

  return (
    <div className="admin-prijedlog">
      <p className="prijedlog-oznaka">{OZNAKA_PRAVILA}</p>

      <div className="admin-prijedlog-mreza">
        <div>
          <p className="admin-prijedlog-naslov">Kategorija</p>
          <p className="mali-tekst">
            Prijedlog pravila:{' '}
            <strong>{predlozenaKat ? predlozenaKat.naziv : 'nema prijedloga (nema ključnih riječi)'}</strong>
            {pogociKategorije.length > 0 && (
              <span className="prigusen"> – riječi: {pogociKategorije[0].rijeci.join(', ')}</span>
            )}
          </p>
          <label htmlFor={`${idPrefiks}-kat`} className="mali-tekst">
            Konačna kategorija
          </label>
          <select id={`${idPrefiks}-kat`} value={kategorija} onChange={(e) => promijeniKategoriju(e.target.value)}>
            {KATEGORIJE.map((k) => (
              <option key={k.kljuc} value={k.kljuc}>
                {k.naziv}
                {k.kljuc === prijava.predlozenaKategorija ? ' ✓ prijedlog' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="admin-prijedlog-naslov">Prioritet</p>
          <p className="mali-tekst">
            Prijedlog pravila: <strong>{PRIORITETI[predlozeniPr]}</strong> ({bodovi} bod.)
          </p>
          {razlozi.length > 0 ? (
            <ul className="admin-razlozi">
              {razlozi.map((r) => (
                <li key={r.pravilo}>
                  {r.pravilo} <strong>+{r.bodovi}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mali-tekst prigusen">Nijedno pravilo se nije aktiviralo (0 bodova).</p>
          )}
          <label htmlFor={`${idPrefiks}-pr`} className="mali-tekst">
            Potvrđeni prioritet
          </label>
          <select id={`${idPrefiks}-pr`} value={prioritet} onChange={(e) => promijeniPrioritet(e.target.value)}>
            {Object.entries(PRIORITETI).map(([kljuc, naziv]) => (
              <option key={kljuc} value={kljuc}>
                {naziv}
                {kljuc === predlozeniPr ? ' ✓ prijedlog' : ''}
              </option>
            ))}
          </select>
          <p className="mali-tekst prigusen admin-napomena-prioritet">{NAPOMENA_PRIORITET}</p>
        </div>
      </div>
    </div>
  )
}
