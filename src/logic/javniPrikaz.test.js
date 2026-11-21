import { describe, it, expect } from 'vitest'
import { uJavniPrikaz, jeJavna } from './javniPrikaz.js'

function primjer(izmjene = {}) {
  return {
    id: 'x1',
    opcina: 'ilidza',
    naslov: 'Naslov',
    opis: 'Opis',
    kategorija: 'ceste',
    predlozenaKategorija: 'ceste',
    predlozeniPrioritet: 'visok',
    potvrdjeniPrioritet: 'srednji',
    naselje: 'Stup',
    lat: 43.85,
    lng: 18.33,
    fotografijaId: 'foto-x1',
    fotografijaSkrivena: false,
    datumPrijave: '2026-11-01T10:00:00.000Z',
    status: 'ZAPRIMLJENO',
    historijaStatusa: [{ status: 'NA_CEKANJU', datum: '2026-11-01T10:00:00.000Z' }],
    razlogOdbijanja: null,
    internaNapomena: 'tajna napomena',
    glavnaPrijavaId: null,
    brojPrijavitelja: 1,
    autorId: 'demo-gradjanin',
    testniPodatak: true,
    ...izmjene,
  }
}

describe('javni prikaz', () => {
  it('nikad ne sadrži autora, internu napomenu ni predloženi prioritet', () => {
    const javna = uJavniPrikaz(primjer())
    expect(javna).not.toHaveProperty('autorId')
    expect(javna).not.toHaveProperty('internaNapomena')
    expect(javna).not.toHaveProperty('predlozeniPrioritet')
    expect(JSON.stringify(javna)).not.toContain('tajna napomena')
    expect(JSON.stringify(javna)).not.toContain('demo-gradjanin')
  })

  it('ne propušta nepoznata nova polja', () => {
    const javna = uJavniPrikaz(primjer({ novoTajnoPolje: 'ne smije se vidjeti' }))
    expect(javna).not.toHaveProperty('novoTajnoPolje')
  })

  it('prijave na čekanju i odbijene nisu javne', () => {
    expect(uJavniPrikaz(primjer({ status: 'NA_CEKANJU' }))).toBeNull()
    expect(uJavniPrikaz(primjer({ status: 'ODBIJENO' }))).toBeNull()
    expect(jeJavna(null)).toBe(false)
  })

  it('sva četiri javna statusa su javna', () => {
    for (const status of ['ZAPRIMLJENO', 'U_OBRADI', 'PROSLIJEDJENO', 'RIJESENO']) {
      expect(uJavniPrikaz(primjer({ status }))).not.toBeNull()
    }
  })

  it('sakrivena fotografija se ne prikazuje', () => {
    expect(uJavniPrikaz(primjer()).fotografijaId).toBe('foto-x1')
    expect(uJavniPrikaz(primjer({ fotografijaSkrivena: true })).fotografijaId).toBeNull()
  })

  it('izmjena javne kopije ne mijenja original', () => {
    const original = primjer()
    const javna = uJavniPrikaz(original)
    javna.historijaStatusa[0].status = 'RIJESENO'
    expect(original.historijaStatusa[0].status).toBe('NA_CEKANJU')
  })
})
