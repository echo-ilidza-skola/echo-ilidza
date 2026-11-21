// Natpis statusa. Naziv dolazi iz konstanti, pa "Proslijeđeno službi" UVIJEK nosi "(simulacija)".

import { nazivStatusa } from '../data/konstante.js'

export default function StatusOznaka({ status }) {
  return <span className={`status-natpis status-natpis--${status.toLowerCase()}`}>{nazivStatusa(status)}</span>
}
