// Natpis statusa: znak eha (EhoStatus) i naziv statusa. Naziv dolazi iz konstanti,
// pa "Proslijeđeno službi" UVIJEK nosi "(simulacija)".
// Status se nikad ne prikazuje samo crtežom – naziv je uvijek vidljiv uz znak eha.
// Čitač ekrana pročita opis znaka (npr. "Status: U obradi, korak 2 od 4"), pa vidljivi naziv preskače.

import EhoStatus from './EhoStatus.jsx'
import { nazivStatusa } from '../data/konstante.js'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function StatusOznaka({ status, velicinaEha = 22, animacija = 'ne' }) {
  const { jezik } = useJezik()
  return (
    <span className={`status-natpis status-natpis--${status.toLowerCase()}`}>
      <EhoStatus status={status} velicina={velicinaEha} animacija={animacija} />
      <span aria-hidden="true">{nazivStatusa(status, jezik)}</span>
    </span>
  )
}
