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

  it('dodajPrijavu sprema prijavu na čekanju koja nije javna', () => {
    storage.inicijalizuj()
    const nova = storage.dodajPrijavu(
      { naslov: 'Nova rupa', opis: 'Opis', kategorija: 'ceste', lat: 43.83, lng: 18.31 },
      'demo-gradjanin',
    )
    expect(storage.svePrijave()).toHaveLength(29)
    expect(storage.dohvatiPrijavu(nova.id).status).toBe('NA_CEKANJU')
    expect(storage.javnaPrijava(nova.id)).toBeNull()
    expect(storage.javnePrijave().some((p) => p.id === nova.id)).toBe(false)
    expect(storage.prijaveAutora('demo-gradjanin').some((p) => p.id === nova.id)).toBe(true)
  })

  it('potvrda iste prijave povećava broj prijavitelja glavne i čuva vezu', () => {
    storage.inicijalizuj()
    const prije = storage.dohvatiPrijavu('t14').brojPrijavitelja
    const nova = storage.dodajPrijavu(
      { naslov: 'Mrak', opis: 'Ne svijetli', kategorija: 'rasvjeta', lat: 43.851, lng: 18.3375, glavnaPrijavaId: 't14' },
      'demo-gradjanin',
    )
    expect(nova.glavnaPrijavaId).toBe('t14')
    expect(storage.dohvatiPrijavu('t14').brojPrijavitelja).toBe(prije + 1)
  })

  it('veza s nepostojećom glavnom prijavom se ne sprema', () => {
    storage.inicijalizuj()
    const nova = storage.dodajPrijavu(
      { naslov: 'X', opis: 'Y', kategorija: 'ceste', lat: 43.83, lng: 18.31, glavnaPrijavaId: 'ne-postoji' },
      'demo-gradjanin',
    )
    expect(nova.glavnaPrijavaId).toBeNull()
  })

  it('fotografije bez IndexedDB-a (npr. u testu) ne ruše aplikaciju', async () => {
    expect(await storage.ucitajFotografiju('foto-1')).toBeNull()
    expect(await storage.ucitajFotografiju(null)).toBeNull()
    await expect(storage.sacuvajFotografiju(new Blob(['x']))).rejects.toThrow('Fotografiju nije moguće spremiti')
    await expect(storage.obrisiSveFotografije()).resolves.toBeUndefined()
  })

  it('administrator odobri prijavu: postaje javna, s potvrđenom kategorijom i prioritetom', () => {
    storage.inicijalizuj()
    const p = storage.odobriPrijavu('t19', { kategorija: 'okolis', prioritet: 'srednji' })
    expect(p.status).toBe('ZAPRIMLJENO')
    expect(p.potvrdjeniPrioritet).toBe('srednji')
    expect(storage.javnaPrijava('t19')).not.toBeNull()
    expect(storage.dohvatiPrijavu('t19').historijaStatusa.at(-1).status).toBe('ZAPRIMLJENO')
  })

  it('administrator odbije prijavu uz razlog; autor vidi razlog, prijava nije javna', () => {
    storage.inicijalizuj()
    expect(() => storage.odbijPrijavu('t10', '')).toThrow()
    storage.odbijPrijavu('t10', 'Lokacija nije precizna')
    const p = storage.prijaveAutora('testni-korisnik-07').find((x) => x.id === 't10')
    expect(p.status).toBe('ODBIJENO')
    expect(p.razlogOdbijanja).toBe('Lokacija nije precizna')
    expect(storage.javnaPrijava('t10')).toBeNull()
  })

  it('promjena statusa se vidi u javnom prikazu i historiji', () => {
    storage.inicijalizuj()
    storage.promijeniStatusPrijave('t02', 'RIJESENO', 'Kontejner ispražnjen')
    const javna = storage.javnaPrijava('t02')
    expect(javna.status).toBe('RIJESENO')
    expect(javna.historijaStatusa.at(-1)).toMatchObject({ status: 'RIJESENO', napomena: 'Kontejner ispražnjen' })
  })

  it('interna napomena i sakrivena fotografija ne izlaze u javni prikaz', () => {
    storage.inicijalizuj()
    storage.sacuvajInternuNapomenu('t02', 'Tajna napomena admina')
    storage.postaviSakrivenuFotografiju('t02', true)
    const javna = storage.javnaPrijava('t02')
    expect(JSON.stringify(javna)).not.toContain('Tajna napomena')
    expect(javna.fotografijaId).toBeNull()
    expect(storage.dohvatiPrijavu('t02').internaNapomena).toBe('Tajna napomena admina')
  })

  it('ručno povezivanje i razdvajanje mijenjaju broj prijavitelja', () => {
    storage.inicijalizuj()
    storage.poveziPrijavu('t13', 't04')
    expect(storage.dohvatiPrijavu('t04').brojPrijavitelja).toBe(4)
    storage.razdvojiPrijavu('t13')
    expect(storage.dohvatiPrijavu('t04').brojPrijavitelja).toBe(3)
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
