import { describe, it, expect } from 'vitest'
import { predloziKategoriju } from './prijedlogKategorije.js'
import { predloziPrioritet, prioritetIzBodova } from './prioritet.js'

describe('predloziKategoriju', () => {
  it('prazan tekst nema prijedloga', () => {
    expect(predloziKategoriju('', '')).toEqual({ kategorija: null, pogoci: [] })
    expect(predloziKategoriju(undefined, null).kategorija).toBeNull()
    expect(predloziKategoriju('   ', '  ').kategorija).toBeNull()
  })

  it('tekst bez ključnih riječi nema prijedloga', () => {
    expect(predloziKategoriju('Glasna muzika navečer', 'Komšije su glasne.').kategorija).toBeNull()
  })

  it('predlaže kategoriju iz naslova i opisa', () => {
    expect(predloziKategoriju('Velika rupa', 'Oštećen asfalt').kategorija).toBe('ceste')
    expect(predloziKategoriju('Problem', 'Kontejner je pun.').kategorija).toBe('otpad')
  })

  it('radi s dijakriticima i bez njih', () => {
    expect(predloziKategoriju('Smeće pored puta', '').kategorija).toBe('otpad')
    expect(predloziKategoriju('Smece pored puta', '').kategorija).toBe('otpad')
    expect(predloziKategoriju('DJUBRE', '').kategorija).toBe('otpad')
    expect(predloziKategoriju('Ljuljacka polomljena', '').kategorija).toBe('igralista')
    expect(predloziKategoriju('Pjesacki prelaz', 'nema zebre').kategorija).toBe('sigurnost')
  })

  it('bira kategoriju s najviše pogodaka', () => {
    // 1 pogodak za rasvjetu (lampa), 2 za ceste (rupa, trotoar).
    const r = predloziKategoriju('Rupa na trotoaru', 'Pored lampe.')
    expect(r.kategorija).toBe('ceste')
    expect(r.pogoci[0]).toEqual({ kategorija: 'ceste', broj: 2, rijeci: ['rupa', 'trotoar'] })
    expect(r.pogoci[1].kategorija).toBe('rasvjeta')
  })

  it('kod istog broja pogodaka bira kategoriju koja je ranije na listi', () => {
    // "rupa" (ceste) i "lampa" (rasvjeta): po 1 pogodak; ceste su prve na listi.
    expect(predloziKategoriju('Rupa i lampa', '').kategorija).toBe('ceste')
  })

  it('ne pronalazi "rupa" u riječi "grupa"', () => {
    expect(predloziKategoriju('Grupa djece', '').kategorija).toBeNull()
  })

  it('POZNATO OGRANIČENJE: pravila ne razumiju značenje riječi', () => {
    // "kasno" počinje kao "kasni", pa pravila predlažu javni prevoz.
    // Zato konačnu kategoriju uvijek potvrđuje administrator.
    expect(predloziKategoriju('Glasna muzika', 'Čuje se kasno navečer.').kategorija).toBe('prevoz')
  })
})

describe('prioritetIzBodova', () => {
  it('granice: 0–2 nizak, 3–4 srednji, 5+ visok', () => {
    expect(prioritetIzBodova(0)).toBe('nizak')
    expect(prioritetIzBodova(2)).toBe('nizak')
    expect(prioritetIzBodova(3)).toBe('srednji')
    expect(prioritetIzBodova(4)).toBe('srednji')
    expect(prioritetIzBodova(5)).toBe('visok')
    expect(prioritetIzBodova(12)).toBe('visok')
  })
})

describe('predloziPrioritet', () => {
  it('prazan tekst bez povezanih prijava: nizak, 0 bodova, bez razloga', () => {
    expect(predloziPrioritet('', '')).toEqual({ prioritet: 'nizak', bodovi: 0, razlozi: [] })
  })

  it('riječ opasnosti daje +3 (srednji)', () => {
    const r = predloziPrioritet('Opasno mjesto', '')
    expect(r.bodovi).toBe(3)
    expect(r.prioritet).toBe('srednji')
    expect(r.razlozi).toHaveLength(1)
    expect(r.razlozi[0].pravilo).toContain('opasno')
  })

  it('više riječi opasnosti i dalje daje +3, ali su sve navedene u razlogu', () => {
    const r = predloziPrioritet('Otvoren šaht, opasno', 'Dijete je palo, moglo se povrijediti.')
    expect(r.bodovi).toBe(3)
    expect(r.razlozi[0].pravilo).toContain('otvoren šaht')
    expect(r.razlozi[0].pravilo).toContain('povrijed')
  })

  it('pronalazi oblike riječi i tekst bez dijakritika', () => {
    expect(predloziPrioritet('opasna rupa', '').bodovi).toBe(3)
    expect(predloziPrioritet('otvoreni saht', '').bodovi).toBe(3)
    expect(predloziPrioritet('Neko se ozlijedio', '').bodovi).toBe(3)
    expect(predloziPrioritet('Covjek je pao', '').bodovi).toBe(3)
    expect(predloziPrioritet('kod skole', '').bodovi).toBe(2)
    expect(predloziPrioritet('ispred vrtica', '').bodovi).toBe(2)
  })

  it('škola + opasnost = 5 (visok)', () => {
    const r = predloziPrioritet('Opasno ispred škole', '')
    expect(r.bodovi).toBe(5)
    expect(r.prioritet).toBe('visok')
    expect(r.razlozi).toHaveLength(2)
  })

  it('svaka povezana prijava daje +1', () => {
    expect(predloziPrioritet('Rupa', '', 1).bodovi).toBe(1)
    const r = predloziPrioritet('Rupa', '', 3)
    expect(r.bodovi).toBe(3)
    expect(r.prioritet).toBe('srednji')
    // Razlog ima i ključ prevoda (za engleski prikaz); bosanski tekst i bodovi su isti kao i ranije.
    expect(r.razlozi[0]).toMatchObject({ pravilo: 'Povezane prijave: 3', bodovi: 3, kljuc: 'pp.razlogPovezane' })
  })

  it('neispravan broj povezanih prijava se tretira kao 0', () => {
    expect(predloziPrioritet('Rupa', '', -2).bodovi).toBe(0)
    expect(predloziPrioritet('Rupa', '', undefined).bodovi).toBe(0)
    expect(predloziPrioritet('Rupa', '', 'abc').bodovi).toBe(0)
  })
})

describe('engleske ključne riječi', () => {
  it('predlaže kategoriju i za prijavu napisanu na engleskom', () => {
    expect(predloziKategoriju('Big pothole on the road', 'The sidewalk is broken too').kategorija).toBe('ceste')
    expect(predloziKategoriju('Overflowing garbage', 'Trash everywhere next to the container').kategorija).toBe('otpad')
    expect(predloziKategoriju('Open manhole', 'The cover is missing').kategorija).toBe('infrastruktura')
  })

  it('prioritet: engleske riječi opasnosti i škole', () => {
    const r = predloziPrioritet('Open manhole near the school', 'Very dangerous, a child fell')
    expect(r.bodovi).toBe(5)
    expect(r.prioritet).toBe('visok')
  })
})
