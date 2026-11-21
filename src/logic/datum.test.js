import { describe, it, expect } from 'vitest'
import { formatirajDatum } from './datum.js'

describe('formatirajDatum', () => {
  // Datum pravimo u lokalnom vremenu, da test ne zavisi od vremenske zone.
  const iso = new Date(2026, 10, 21, 9, 5).toISOString()

  it('prikazuje dan, mjesec i godinu', () => {
    expect(formatirajDatum(iso)).toBe('21. 11. 2026.')
  })

  it('može prikazati i vrijeme', () => {
    expect(formatirajDatum(iso, true)).toBe('21. 11. 2026. u 09:05')
  })

  it('neispravan datum ne ruši prikaz', () => {
    expect(formatirajDatum('nije datum')).toBe('nepoznat datum')
    expect(formatirajDatum(undefined)).toBe('nepoznat datum')
  })
})
