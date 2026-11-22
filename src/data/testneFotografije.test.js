import { describe, it, expect } from 'vitest'
import { dopuniTestneFotografije } from './testneFotografije.js'

describe('dopuniTestneFotografije', () => {
  it('testnoj prijavi bez fotografije upisuje ključ njene testne fotografije', () => {
    const { prijave, dopunjeno } = dopuniTestneFotografije([{ id: 't02', testniPodatak: true, fotografijaId: null }])
    expect(prijave[0].fotografijaId).toBe('test:t02')
    expect(dopunjeno).toBe(1)
  })

  it('ne dira prijavu koja već ima fotografiju', () => {
    const p = { id: 't02', testniPodatak: true, fotografijaId: 'foto-123' }
    const { prijave, dopunjeno } = dopuniTestneFotografije([p])
    expect(prijave[0]).toBe(p)
    expect(dopunjeno).toBe(0)
  })

  it('ne dira testne prijave bez testne fotografije ni prijave s drugim id-jem', () => {
    const lista = [
      { id: 't01', testniPodatak: true, fotografijaId: null },
      { id: 'p-abc', testniPodatak: true, fotografijaId: null },
    ]
    const { prijave, dopunjeno } = dopuniTestneFotografije(lista)
    expect(prijave).toEqual(lista)
    expect(dopunjeno).toBe(0)
  })
})
