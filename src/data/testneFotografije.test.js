import { describe, it, expect } from 'vitest'
import { dopuniTestneFotografije, TESTNE_FOTOGRAFIJE, jeTestnaFotografija } from './testneFotografije.js'
import { SPISAK_TESTNIH_FOTOGRAFIJA } from '../assets/testne-fotografije/spisak.js'

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

describe('spisak testnih fotografija', () => {
  it('svaki red spiska vodi do fotografije koja postoji u folderu', () => {
    for (const [id, stavka] of Object.entries(SPISAK_TESTNIH_FOTOGRAFIJA)) {
      expect(TESTNE_FOTOGRAFIJE[id], `${id}: ${stavka.fajl}`).toBeTruthy()
      expect(TESTNE_FOTOGRAFIJE[id].url).toBeTruthy()
    }
  })

  it('prepoznaje ključ testne fotografije', () => {
    expect(jeTestnaFotografija('test:t04')).toBe(true)
    expect(jeTestnaFotografija('foto-123')).toBe(false)
    expect(jeTestnaFotografija(null)).toBe(false)
  })
})
