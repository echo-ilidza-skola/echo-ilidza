import { describe, it, expect } from 'vitest'
import { koraciNapretka, procenatNapretka } from './napredak.js'

const H = (...koraci) => koraci.map(([status, datum]) => ({ status, datum }))

describe('koraciNapretka', () => {
  it('prijava u obradi: dva gotova koraka, trenutni i dva buduća', () => {
    const k = koraciNapretka({
      status: 'U_OBRADI',
      historijaStatusa: H(['NA_CEKANJU', 'd1'], ['ZAPRIMLJENO', 'd2'], ['U_OBRADI', 'd3']),
    })
    expect(k.map((x) => x.stanje)).toEqual(['gotov', 'gotov', 'trenutni', 'buduci', 'buduci'])
    expect(k.map((x) => x.datum)).toEqual(['d1', 'd2', 'd3', null, null])
  })

  it('"Proslijeđeno" uvijek nosi oznaku simulacije', () => {
    const k = koraciNapretka({ status: 'NA_CEKANJU', historijaStatusa: H(['NA_CEKANJU', 'd1']) })
    expect(k.find((x) => x.status === 'PROSLIJEDJENO').naziv).toContain('simulacija')
    expect(k.find((x) => x.status === 'PROSLIJEDJENO').punNaziv).toContain('simulacija')
  })

  it('odbijena prijava ima samo dva koraka', () => {
    const k = koraciNapretka({ status: 'ODBIJENO', historijaStatusa: H(['NA_CEKANJU', 'd1'], ['ODBIJENO', 'd2']) })
    expect(k.map((x) => [x.status, x.stanje, x.datum])).toEqual([
      ['NA_CEKANJU', 'gotov', 'd1'],
      ['ODBIJENO', 'odbijen', 'd2'],
    ])
  })

  it('uzima posljednji datum ulaska u status i ne prikazuje datum budućih koraka', () => {
    const k = koraciNapretka({
      status: 'ZAPRIMLJENO',
      historijaStatusa: H(['NA_CEKANJU', 'd1'], ['ZAPRIMLJENO', 'd2'], ['U_OBRADI', 'd3'], ['ZAPRIMLJENO', 'd4']),
    })
    expect(k[1].datum).toBe('d4')
    expect(k[2].datum).toBeNull()
  })

  it('radi i bez historije', () => {
    expect(koraciNapretka({ status: 'NA_CEKANJU' })[0].datum).toBeNull()
  })
})

describe('procenatNapretka', () => {
  it('od 0 % (na čekanju) do 100 % (riješeno)', () => {
    expect(procenatNapretka({ status: 'NA_CEKANJU' })).toBe(0)
    expect(procenatNapretka({ status: 'U_OBRADI' })).toBe(50)
    expect(procenatNapretka({ status: 'RIJESENO' })).toBe(100)
    expect(procenatNapretka({ status: 'ODBIJENO' })).toBe(100)
  })
})
