// Administracija. U etapi 1 postoji samo pregled stanja testnih podataka
// i dugme "Vrati testne podatke". Moderacija dolazi u etapi 5.

import UIzradi from '../../components/UIzradi.jsx'
import { usePodaci } from '../../hooks/usePodaci.js'
import { svePrijave, vratiTestnePodatke } from '../../data/storage.js'
import { STATUSI } from '../../data/konstante.js'

export default function Administracija() {
  const prijave = usePodaci(svePrijave)

  function naVratiTestnePodatke() {
    const potvrda = window.confirm(
      'Ovo briše SVE prijave u ovom pregledniku (i vaše izmjene) i ponovo učitava 28 testnih prijava. Nastaviti?',
    )
    if (potvrda) vratiTestnePodatke()
  }

  return (
    <section>
      <h1>Administracija</h1>
      <UIzradi etapa={5}>Red čekanja, promjena statusa, napomene i povezivanje dolaze u etapi 5.</UIzradi>

      <div className="kartica">
        <h2>Stanje podataka u ovom pregledniku</h2>
        <p>Ukupno prijava: {prijave.length}</p>
        <ul>
          {Object.entries(STATUSI).map(([kljuc, { naziv }]) => (
            <li key={kljuc}>
              {naziv}: {prijave.filter((p) => p.status === kljuc).length}
            </li>
          ))}
        </ul>
        <button type="button" className="dugme dugme-upozorenje" onClick={naVratiTestnePodatke}>
          Vrati testne podatke
        </button>
      </div>
    </section>
  )
}
