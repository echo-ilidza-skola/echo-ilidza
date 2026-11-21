import { describe, it, expect, beforeEach, vi } from 'vitest'

// Jednostavna zamjena za localStorage, jer testovi ne rade u pregledniku.
function napraviLazniStorage() {
  let podaci = {}
  return {
    getItem: (k) => (k in podaci ? podaci[k] : null),
    setItem: (k, v) => {
      podaci[k] = String(v)
    },
    removeItem: (k) => {
      delete podaci[k]
    },
    clear: () => {
      podaci = {}
    },
  }
}

vi.stubGlobal('localStorage', napraviLazniStorage())

const storage = await import('./storage.js')

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('pri prvom pokretanju učita 28 testnih prijava', () => {
    expect(storage.inicijalizuj().ucitaniTestniPodaci).toBe(true)
    expect(storage.svePrijave()).toHaveLength(28)
    // Drugo pokretanje ne briše postojeće podatke.
    expect(storage.inicijalizuj().ucitaniTestniPodaci).toBe(false)
  })

  it('oštećeni podaci se zamijene testnim podacima umjesto da se aplikacija sruši', () => {
    localStorage.setItem('echo.prijave.v1', '{ovo nije JSON')
    expect(storage.svePrijave()).toEqual([])
    expect(storage.inicijalizuj().ucitaniTestniPodaci).toBe(true)
    expect(storage.svePrijave()).toHaveLength(28)
  })

  it('javne prijave su samo odobrene i bez privatnih polja', () => {
    storage.inicijalizuj()
    const javne = storage.javnePrijave()
    expect(javne.length).toBeGreaterThan(0)
    expect(javne.length).toBeLessThan(28)
    for (const p of javne) {
      expect(['ZAPRIMLJENO', 'U_OBRADI', 'PROSLIJEDJENO', 'RIJESENO']).toContain(p.status)
      expect(p).not.toHaveProperty('autorId')
      expect(p).not.toHaveProperty('internaNapomena')
      expect(p).not.toHaveProperty('predlozeniPrioritet')
    }
  })

  it('javnaPrijava vraća null za prijavu na čekanju i za nepostojeći id', () => {
    storage.inicijalizuj()
    const naCekanju = storage.svePrijave().find((p) => p.status === 'NA_CEKANJU')
    expect(storage.javnaPrijava(naCekanju.id)).toBeNull()
    expect(storage.javnaPrijava('ne-postoji')).toBeNull()
  })

  it('prijaveAutora vraća samo prijave tog autora', () => {
    storage.inicijalizuj()
    const moje = storage.prijaveAutora('demo-gradjanin')
    expect(moje.length).toBeGreaterThan(0)
    expect(moje.every((p) => p.autorId === 'demo-gradjanin')).toBe(true)
  })

  it('vratiTestnePodatke briše izmjene i ponovo učitava 28 prijava', () => {
    localStorage.setItem('echo.prijave.v1', JSON.stringify([{ id: 'nesto' }]))
    storage.vratiTestnePodatke()
    expect(storage.svePrijave()).toHaveLength(28)
  })

  it('demo uloga: nepoznata vrijednost postaje Gost', () => {
    expect(storage.ucitajUlogu()).toBe('gost')
    expect(storage.sacuvajUlogu('administrator')).toBe(true)
    expect(storage.ucitajUlogu()).toBe('administrator')
    expect(storage.sacuvajUlogu('haker')).toBe(false)
    localStorage.setItem('echo.uloga', '"nesto"')
    expect(storage.ucitajUlogu()).toBe('gost')
  })
})
