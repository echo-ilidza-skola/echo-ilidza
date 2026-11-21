import { describe, it, expect } from 'vitest'
import {
  dozvoljeniStatusi,
  promijeniStatus,
  potvrdiKategorijuIPrioritet,
  poveziPrijave,
  razdvojiPrijave,
  idGlavneGrupe,
  filtrirajZaAdmina,
  NAPOMENA_SIMULACIJA,
} from './administracija.js'
import { napraviTestnePodatke } from '../data/testniPodaci.js'
import { uJavniPrikaz } from './javniPrikaz.js'

const SADA = new Date('2026-11-21T12:00:00Z')

function prijava(izmjene = {}) {
  return {
    id: 'x',
    naslov: 'Rupa',
    opis: 'Opis',
    kategorija: 'ceste',
    status: 'NA_CEKANJU',
    historijaStatusa: [{ status: 'NA_CEKANJU', datum: '2026-11-20T10:00:00.000Z' }],
    razlogOdbijanja: null,
    glavnaPrijavaId: null,
    brojPrijavitelja: 1,
    predlozeniPrioritet: 'nizak',
    potvrdjeniPrioritet: null,
    ...izmjene,
  }
}

describe('dozvoljeniStatusi', () => {
  it('prijava na čekanju se može samo odobriti ili odbiti', () => {
    expect(dozvoljeniStatusi('NA_CEKANJU')).toEqual(['ZAPRIMLJENO', 'ODBIJENO'])
  })

  it('odbijena se može vratiti na provjeru, ali ne direktno objaviti', () => {
    expect(dozvoljeniStatusi('ODBIJENO')).toEqual(['NA_CEKANJU'])
  })

  it('javna prijava ide u bilo koji drugi javni status, ali ne u odbijeno', () => {
    expect(dozvoljeniStatusi('U_OBRADI').sort()).toEqual(['PROSLIJEDJENO', 'RIJESENO', 'ZAPRIMLJENO'])
    expect(dozvoljeniStatusi('RIJESENO')).not.toContain('ODBIJENO')
  })
})

describe('promijeniStatus', () => {
  it('odobravanje upisuje korak u historiju i prijava postaje javna', () => {
    const p = promijeniStatus(prijava(), 'ZAPRIMLJENO', { napomena: 'Odobreno', sada: SADA })
    expect(p.status).toBe('ZAPRIMLJENO')
    expect(p.historijaStatusa).toHaveLength(2)
    expect(p.historijaStatusa[1]).toEqual({ status: 'ZAPRIMLJENO', datum: SADA.toISOString(), napomena: 'Odobreno' })
    expect(uJavniPrikaz(p)).not.toBeNull()
  })

  it('odbijanje traži razlog; razlog se čuva, prijava nije javna', () => {
    expect(() => promijeniStatus(prijava(), 'ODBIJENO', { napomena: '   ' })).toThrow('razlog')
    const p = promijeniStatus(prijava(), 'ODBIJENO', { napomena: 'Nedovoljno podataka', sada: SADA })
    expect(p.razlogOdbijanja).toBe('Nedovoljno podataka')
    expect(uJavniPrikaz(p)).toBeNull()
  })

  it('"Proslijeđeno službi" uvijek dobija napomenu o simulaciji', () => {
    const javna = prijava({ status: 'U_OBRADI' })
    expect(promijeniStatus(javna, 'PROSLIJEDJENO').historijaStatusa.at(-1).napomena).toBe(NAPOMENA_SIMULACIJA)
    const sTekstom = promijeniStatus(javna, 'PROSLIJEDJENO', { napomena: 'Komunalna služba' })
    expect(sTekstom.historijaStatusa.at(-1).napomena).toContain(NAPOMENA_SIMULACIJA)
    expect(sTekstom.historijaStatusa.at(-1).napomena).toContain('Komunalna služba')
  })

  it('nedozvoljena promjena baca grešku i ne mijenja original', () => {
    const original = prijava()
    expect(() => promijeniStatus(original, 'RIJESENO')).toThrow('nije dozvoljena')
    expect(original.status).toBe('NA_CEKANJU')
  })

  it('vraćanje odbijene na provjeru briše razlog', () => {
    const odbijena = prijava({ status: 'ODBIJENO', razlogOdbijanja: 'x' })
    expect(promijeniStatus(odbijena, 'NA_CEKANJU').razlogOdbijanja).toBeNull()
  })

  it('bez napomene korak nema polje napomena', () => {
    const p = promijeniStatus(prijava({ status: 'ZAPRIMLJENO' }), 'U_OBRADI')
    expect(p.historijaStatusa.at(-1)).not.toHaveProperty('napomena')
  })
})

describe('potvrdiKategorijuIPrioritet', () => {
  it('čuva prijedlog pravila i postavlja potvrđene vrijednosti', () => {
    const p = potvrdiKategorijuIPrioritet(prijava({ predlozenaKategorija: 'ceste' }), 'infrastruktura', 'visok')
    expect(p.kategorija).toBe('infrastruktura')
    expect(p.potvrdjeniPrioritet).toBe('visok')
    expect(p.predlozenaKategorija).toBe('ceste')
    expect(p.predlozeniPrioritet).toBe('nizak')
  })

  it('neispravne vrijednosti bacaju grešku', () => {
    expect(() => potvrdiKategorijuIPrioritet(prijava(), 'nepostoji', 'visok')).toThrow()
    expect(() => potvrdiKategorijuIPrioritet(prijava(), 'ceste', 'hitno')).toThrow()
  })
})

describe('povezivanje i razdvajanje', () => {
  const podaci = () => napraviTestnePodatke(SADA)

  it('povezivanje povećava broj prijavitelja glavne prijave', () => {
    // t13 (ceste, Stup) povezujemo s grupom t04 (ceste, 3 prijavitelja)
    const nove = poveziPrijave(podaci(), 't13', 't04')
    expect(nove.find((p) => p.id === 't13').glavnaPrijavaId).toBe('t04')
    expect(nove.find((p) => p.id === 't04').brojPrijavitelja).toBe(4)
  })

  it('povezivanje s povezanom prijavom ide na njenu glavnu', () => {
    const nove = poveziPrijave(podaci(), 't13', 't05') // t05 je povezana s t04
    expect(nove.find((p) => p.id === 't13').glavnaPrijavaId).toBe('t04')
    expect(idGlavneGrupe(nove, 't05')).toBe('t04')
  })

  it('glavna prijava sa svojim povezanim prijavama prelazi cijela u novu grupu', () => {
    // t14 (rasvjeta, glavna za t15) povezujemo s t01 (rasvjeta)
    const nove = poveziPrijave(podaci(), 't14', 't01')
    expect(nove.find((p) => p.id === 't15').glavnaPrijavaId).toBe('t01')
    expect(nove.find((p) => p.id === 't01').brojPrijavitelja).toBe(3)
    expect(nove.find((p) => p.id === 't14').brojPrijavitelja).toBe(1)
  })

  it('ne povezuje sa samom sobom ni različite kategorije', () => {
    expect(() => poveziPrijave(podaci(), 't04', 't05')).toThrow('sama sa sobom')
    expect(() => poveziPrijave(podaci(), 't13', 't01')).toThrow('iste kategorije')
  })

  it('razdvajanje smanjuje broj prijavitelja glavne', () => {
    const nove = razdvojiPrijave(podaci(), 't05')
    expect(nove.find((p) => p.id === 't05').glavnaPrijavaId).toBeNull()
    expect(nove.find((p) => p.id === 't04').brojPrijavitelja).toBe(2)
    expect(() => razdvojiPrijave(nove, 't05')).toThrow('nije povezana')
  })

  it('povezivanje ponovo računa predloženi prioritet glavne', () => {
    const p = podaci()
    const prije = p.find((x) => x.id === 't21') // srednji: "opasno" +3
    expect(prije.predlozeniPrioritet).toBe('srednji')
    let nove = poveziPrijave(p, 't12', 't21') // infrastruktura
    nove = poveziPrijave(nove, 't24', 't21')
    expect(nove.find((x) => x.id === 't21').predlozeniPrioritet).toBe('visok') // 3 + 2 povezane
  })
})

describe('filtrirajZaAdmina', () => {
  const p = napraviTestnePodatke(SADA)

  it('prazni filteri vraćaju sve', () => {
    expect(filtrirajZaAdmina(p, {})).toHaveLength(28)
  })

  it('filtrira po statusu, kategoriji, naselju i tekstu', () => {
    expect(filtrirajZaAdmina(p, { status: 'ODBIJENO' })).toHaveLength(3)
    expect(filtrirajZaAdmina(p, { kategorija: 'ceste', naselje: 'Ilidža centar' })).toHaveLength(3)
    expect(filtrirajZaAdmina(p, { tekst: 'ŠAHT' }).map((x) => x.id)).toContain('t12')
  })
})
