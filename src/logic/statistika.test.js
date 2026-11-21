import { describe, it, expect } from 'vitest'
import {
  brojPoKategoriji,
  brojPoStatusu,
  brojPoNaselju,
  prosjecnoVrijemeRjesavanjaDana,
  osnovnaStatistika,
  datumRjesavanja,
  posljednjePrijave,
} from './statistika.js'

function p(izmjene) {
  return {
    kategorija: 'ceste',
    status: 'ZAPRIMLJENO',
    naselje: 'Stup',
    datumPrijave: '2026-11-01T00:00:00.000Z',
    historijaStatusa: [],
    ...izmjene,
  }
}

function rijesena(datumPrijave, datumRijeseno) {
  return p({
    status: 'RIJESENO',
    datumPrijave,
    historijaStatusa: [
      { status: 'NA_CEKANJU', datum: datumPrijave },
      { status: 'RIJESENO', datum: datumRijeseno },
    ],
  })
}

describe('prazna lista', () => {
  it('sve funkcije rade s praznom listom', () => {
    expect(brojPoKategoriji([])).toHaveLength(8)
    expect(brojPoKategoriji([]).every((k) => k.broj === 0)).toBe(true)
    expect(brojPoStatusu([]).every((s) => s.broj === 0)).toBe(true)
    expect(brojPoNaselju([]).every((n) => n.broj === 0)).toBe(true)
    expect(prosjecnoVrijemeRjesavanjaDana([])).toBeNull()
    expect(osnovnaStatistika([])).toEqual({ ukupno: 0, rijeseno: 0, uObradi: 0 })
  })
})

describe('brojanje', () => {
  const prijave = [
    p({ kategorija: 'ceste', status: 'U_OBRADI', naselje: 'Stup' }),
    p({ kategorija: 'ceste', status: 'RIJESENO', naselje: 'Otes' }),
    p({ kategorija: 'otpad', status: 'PROSLIJEDJENO', naselje: 'Stup' }),
    p({ kategorija: 'otpad', status: 'ZAPRIMLJENO', naselje: undefined }),
  ]

  it('po kategoriji', () => {
    const r = brojPoKategoriji(prijave)
    expect(r.find((k) => k.kljuc === 'ceste').broj).toBe(2)
    expect(r.find((k) => k.kljuc === 'otpad').broj).toBe(2)
    expect(r.find((k) => k.kljuc === 'rasvjeta').broj).toBe(0)
  })

  it('po statusu', () => {
    const r = brojPoStatusu(prijave)
    expect(r.find((s) => s.kljuc === 'U_OBRADI').broj).toBe(1)
    expect(r.find((s) => s.kljuc === 'PROSLIJEDJENO').naziv).toContain('(simulacija)')
  })

  it('po naselju, s "Nepoznato" za prijave bez naselja', () => {
    const r = brojPoNaselju(prijave)
    expect(r.find((n) => n.naziv === 'Stup').broj).toBe(2)
    expect(r.find((n) => n.naziv === 'Nepoznato').broj).toBe(1)
  })

  it('osnovna statistika: u obradi = U_OBRADI + PROSLIJEDJENO', () => {
    expect(osnovnaStatistika(prijave)).toEqual({ ukupno: 4, rijeseno: 1, uObradi: 2 })
  })
})

describe('posljednjePrijave', () => {
  const prijave = [
    p({ id: 'a', datumPrijave: '2026-11-01T00:00:00.000Z' }),
    p({ id: 'b', datumPrijave: '2026-11-05T00:00:00.000Z' }),
    p({ id: 'c', datumPrijave: '2026-11-03T00:00:00.000Z' }),
  ]

  it('vraća najnovije prve i poštuje broj', () => {
    expect(posljednjePrijave(prijave, 2).map((x) => x.id)).toEqual(['b', 'c'])
    expect(posljednjePrijave(prijave).map((x) => x.id)).toEqual(['b', 'c', 'a'])
  })

  it('ne mijenja ulaznu listu i radi s praznom', () => {
    posljednjePrijave(prijave, 1)
    expect(prijave.map((x) => x.id)).toEqual(['a', 'b', 'c'])
    expect(posljednjePrijave([])).toEqual([])
  })
})

describe('prosječno vrijeme rješavanja', () => {
  it('računa prosjek u danima', () => {
    const prijave = [
      rijesena('2026-11-01T00:00:00.000Z', '2026-11-03T00:00:00.000Z'), // 2 dana
      rijesena('2026-11-01T00:00:00.000Z', '2026-11-07T00:00:00.000Z'), // 6 dana
    ]
    expect(prosjecnoVrijemeRjesavanjaDana(prijave)).toBe(4)
  })

  it('ignoriše neriješene prijave i riješene bez datuma u historiji', () => {
    const prijave = [
      rijesena('2026-11-01T00:00:00.000Z', '2026-11-11T00:00:00.000Z'), // 10 dana
      p({ status: 'U_OBRADI' }),
      p({ status: 'RIJESENO', historijaStatusa: [] }),
    ]
    expect(prosjecnoVrijemeRjesavanjaDana(prijave)).toBe(10)
  })

  it('bez riješenih prijava vraća null', () => {
    expect(prosjecnoVrijemeRjesavanjaDana([p({ status: 'U_OBRADI' })])).toBeNull()
  })

  it('uzima posljednje "Riješeno" iz historije', () => {
    const prijava = p({
      status: 'RIJESENO',
      historijaStatusa: [
        { status: 'RIJESENO', datum: '2026-11-02T00:00:00.000Z' },
        { status: 'U_OBRADI', datum: '2026-11-03T00:00:00.000Z' },
        { status: 'RIJESENO', datum: '2026-11-05T00:00:00.000Z' },
      ],
    })
    expect(datumRjesavanja(prijava)).toBe('2026-11-05T00:00:00.000Z')
  })
})
