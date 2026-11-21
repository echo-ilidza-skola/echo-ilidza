import { describe, it, expect } from 'vitest'
import { noveDimenzije, MAX_STRANA_SLIKE } from './velicinaSlike.js'
import { provjeriOsnovno, provjeriLokaciju, upozorenjeLokacije, imaGresaka } from './validacija.js'
import { napraviNovuPrijavu, povecajBrojPrijavitelja, noviId } from './novaPrijava.js'
import { porukaGps, razlogNedostupnostiGps, GPS_ODBIJENO, GPS_NEDOSTUPNO, GPS_ISTEKLO_VRIJEME } from './gps.js'
import { uJavniPrikaz } from './javniPrikaz.js'

describe('noveDimenzije', () => {
  it('veća slika se smanji na 1024 px po dužoj strani, uz isti omjer', () => {
    expect(noveDimenzije(4000, 3000)).toEqual({ sirina: 1024, visina: 768 })
    expect(noveDimenzije(3000, 4000)).toEqual({ sirina: 768, visina: 1024 })
  })

  it('slika od tačno 1024 px i manja slika ostaju iste', () => {
    expect(noveDimenzije(1024, 500)).toEqual({ sirina: 1024, visina: 500 })
    expect(noveDimenzije(640, 480)).toEqual({ sirina: 640, visina: 480 })
  })

  it('vrlo uska slika ne postane široka 0 px', () => {
    expect(noveDimenzije(20000, 5)).toEqual({ sirina: MAX_STRANA_SLIKE, visina: 1 })
  })

  it('neispravne dimenzije daju null', () => {
    expect(noveDimenzije(0, 100)).toBeNull()
    expect(noveDimenzije(NaN, 100)).toBeNull()
    expect(noveDimenzije(undefined, undefined)).toBeNull()
  })
})

describe('provjeriOsnovno', () => {
  const ispravno = { naslov: 'Rupa na cesti', opis: 'Duboka rupa.', kategorija: 'ceste' }

  it('ispravan unos nema grešaka', () => {
    expect(provjeriOsnovno(ispravno)).toEqual({})
    expect(imaGresaka(provjeriOsnovno(ispravno))).toBe(false)
  })

  it('prazan naslov, opis i kategorija su greške (i samo razmaci)', () => {
    const g = provjeriOsnovno({ naslov: '   ', opis: '', kategorija: '' })
    expect(Object.keys(g).sort()).toEqual(['kategorija', 'naslov', 'opis'])
  })

  it('naslov od 80 znakova je u redu, 81 nije', () => {
    expect(provjeriOsnovno({ ...ispravno, naslov: 'a'.repeat(80) }).naslov).toBeUndefined()
    expect(provjeriOsnovno({ ...ispravno, naslov: 'a'.repeat(81) }).naslov).toBeTruthy()
  })

  it('opis od 1000 znakova je u redu, 1001 nije', () => {
    expect(provjeriOsnovno({ ...ispravno, opis: 'a'.repeat(1000) }).opis).toBeUndefined()
    expect(provjeriOsnovno({ ...ispravno, opis: 'a'.repeat(1001) }).opis).toBeTruthy()
  })

  it('nepostojeća kategorija je greška', () => {
    expect(provjeriOsnovno({ ...ispravno, kategorija: 'nepostoji' }).kategorija).toBeTruthy()
  })
})

describe('lokacija u obrascu', () => {
  it('bez lokacije je greška', () => {
    expect(provjeriLokaciju(null).lokacija).toBeTruthy()
    expect(provjeriLokaciju({ lat: NaN, lng: 18 }).lokacija).toBeTruthy()
    expect(provjeriLokaciju({ lat: 43.83, lng: 18.31 })).toEqual({})
  })

  it('lokacija izvan Ilidže daje upozorenje, ali ne grešku', () => {
    const vani = { lat: 43.859, lng: 18.428 }
    expect(upozorenjeLokacije(vani)).toContain('izvan')
    expect(provjeriLokaciju(vani)).toEqual({})
    expect(upozorenjeLokacije({ lat: 43.83, lng: 18.31 })).toBeNull()
  })
})

describe('napraviNovuPrijavu', () => {
  const sada = new Date('2026-11-21T10:00:00Z')
  const unos = {
    naslov: '  Otvoren šaht kod škole ',
    opis: 'Opasno za djecu.',
    kategorija: 'infrastruktura',
    lat: 43.7975,
    lng: 18.3175,
  }
  const p = napraviNovuPrijavu(unos, { id: 'p-1', autorId: 'demo-gradjanin', sada })

  it('nova prijava čeka provjeru i ima historiju', () => {
    expect(p.status).toBe('NA_CEKANJU')
    expect(p.historijaStatusa).toEqual([{ status: 'NA_CEKANJU', datum: sada.toISOString() }])
    expect(p.datumPrijave).toBe(sada.toISOString())
  })

  it('nije javna', () => {
    expect(uJavniPrikaz(p)).toBeNull()
  })

  it('čuva prijedloge pravila i ne potvrđuje prioritet', () => {
    expect(p.predlozenaKategorija).toBe('infrastruktura')
    expect(p.predlozeniPrioritet).toBe('visok') // otvoren šaht/opasno +3, škola +2
    expect(p.potvrdjeniPrioritet).toBeNull()
  })

  it('popunjava ostala polja modela', () => {
    expect(p.naslov).toBe('Otvoren šaht kod škole')
    expect(p.naselje).toBe('Hrasnica')
    expect(p.testniPodatak).toBe(true)
    expect(p.opcina).toBe('ilidza')
    expect(p.fotografijaId).toBeNull()
    expect(p.fotografijaSkrivena).toBe(false)
    expect(p.glavnaPrijavaId).toBeNull()
    expect(p.brojPrijavitelja).toBe(1)
    expect(p.autorId).toBe('demo-gradjanin')
  })

  it('čuva fotografiju i vezu s glavnom prijavom kad postoje', () => {
    const q = napraviNovuPrijavu({ ...unos, fotografijaId: 'foto-1', glavnaPrijavaId: 't04' }, { id: 'p-2', autorId: 'x', sada })
    expect(q.fotografijaId).toBe('foto-1')
    expect(q.glavnaPrijavaId).toBe('t04')
  })
})

describe('povecajBrojPrijavitelja', () => {
  it('povećava broj i ponovo računa predloženi prioritet', () => {
    const glavna = { naslov: 'Rupa', opis: 'Opasno.', brojPrijavitelja: 2, predlozeniPrioritet: 'srednji' }
    const nova = povecajBrojPrijavitelja(glavna)
    expect(nova.brojPrijavitelja).toBe(3)
    expect(nova.predlozeniPrioritet).toBe('visok') // opasno +3, 2 povezane +2 = 5
    expect(glavna.brojPrijavitelja).toBe(2) // original se ne mijenja
  })
})

describe('noviId', () => {
  it('daje različite id-jeve', () => {
    const a = noviId(new Date(1000), () => 0.123456)
    const b = noviId(new Date(1000), () => 0.654321)
    expect(a).not.toBe(b)
    expect(a.startsWith('p-')).toBe(true)
  })
})

describe('GPS poruke', () => {
  it('http adresa (nije sigurna) se prepoznaje prije svega', () => {
    expect(razlogNedostupnostiGps({ sigurnaAdresa: false, podrzano: true })).toBe('nesigurno')
    expect(razlogNedostupnostiGps({ sigurnaAdresa: true, podrzano: false })).toBe('nepodrzano')
    expect(razlogNedostupnostiGps({ sigurnaAdresa: true, podrzano: true })).toBeNull()
  })

  it('svaka poruka objašnjava razlog i nudi ručni odabir', () => {
    for (const razlog of ['nesigurno', 'nepodrzano', GPS_ODBIJENO, GPS_NEDOSTUPNO, GPS_ISTEKLO_VRIJEME, 99]) {
      expect(porukaGps(razlog)).toContain('klikom na mapu')
    }
    expect(porukaGps('nesigurno')).toContain('https')
    expect(porukaGps(GPS_ODBIJENO)).toContain('dozvol')
  })
})
