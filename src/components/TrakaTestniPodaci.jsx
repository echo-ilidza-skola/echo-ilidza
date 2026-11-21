// Traka koja je vidljiva na SVAKOM ekranu (nepregovorno pravilo br. 2).

import { TEKST_TESTNI_PODACI } from '../data/konstante.js'

export default function TrakaTestniPodaci() {
  return (
    <div className="traka-testni" role="note">
      <span aria-hidden="true">⚠ </span>
      {TEKST_TESTNI_PODACI}
    </div>
  )
}
