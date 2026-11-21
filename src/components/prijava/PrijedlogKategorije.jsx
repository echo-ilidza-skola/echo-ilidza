// Prijedlog kategorije na osnovu ključnih riječi. Korisnik ga prihvata ili bira drugu kategoriju.
// Ovo su PRAVILA (traženje riječi), NE umjetna inteligencija.

import { kategorijaPoKljucu } from '../../data/konstante.js'
import { predloziKategoriju } from '../../logic/prijedlogKategorije.js'

export const OZNAKA_PRAVILA = 'Prijedlog na osnovu ključnih riječi (pravila, ne AI)'

export default function PrijedlogKategorije({ naslov, opis, odabrana, prihvati }) {
  const imaTeksta = (naslov + opis).trim().length > 0
  const { kategorija, pogoci } = predloziKategoriju(naslov, opis)
  const predlozena = kategorijaPoKljucu(kategorija)

  return (
    <div className="prijedlog-okvir" aria-live="polite">
      <p className="prijedlog-oznaka">{OZNAKA_PRAVILA}</p>
      {!imaTeksta && <p className="prijedlog-tekst">Napišite naslov i opis, pa će se ovdje pojaviti prijedlog.</p>}
      {imaTeksta && !predlozena && (
        <p className="prijedlog-tekst">U tekstu nema poznatih ključnih riječi, pa nema prijedloga. Odaberite kategoriju sami.</p>
      )}
      {predlozena && (
        <div className="prijedlog-red">
          <p className="prijedlog-tekst">
            <span className="kategorija-tacka" style={{ background: predlozena.boja }} aria-hidden="true" />
            <strong>{predlozena.naziv}</strong>
            <span className="prigusen"> – pronađene riječi: {pogoci[0].rijeci.join(', ')}</span>
          </p>
          {odabrana === kategorija ? (
            <span className="prijedlog-prihvacen">✓ Prijedlog je prihvaćen</span>
          ) : (
            <button type="button" className="dugme dugme-sporedno dugme-malo" onClick={() => prihvati(kategorija)}>
              Prihvati prijedlog
            </button>
          )}
        </div>
      )}
    </div>
  )
}
