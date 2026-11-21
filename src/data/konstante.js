// Zajedničke konstante aplikacije: kategorije, statusi, naselja, granice Ilidže.
// Ovdje nema React koda, pa se ovaj fajl može koristiti i u testovima.

export const OPCINA = 'ilidza'

// Fiksni demo korisnik za ulogu "Građanin". Ovo NIJE prava prijava korisnika.
export const DEMO_KORISNIK_ID = 'demo-gradjanin'

// Udaljenost (u metrima) ispod koje se nova prijava iste kategorije predlaže kao mogući duplikat.
export const PRAG_DUPLIKATA_M = 50

export const MAX_NASLOV = 80
export const MAX_OPIS = 1000

// Kategorije: ključ, naziv za prikaz, boja oznake na mapi i ključne riječi za prijedlog.
// Liste ključnih riječi se mogu proširiti.
export const KATEGORIJE = [
  {
    kljuc: 'ceste',
    naziv: 'Ceste i trotoari',
    boja: '#6B4E9B',
    kljucneRijeci: ['rupa', 'udarna rupa', 'asfalt', 'trotoar', 'pločnik', 'oštećena cesta'],
  },
  {
    kljuc: 'rasvjeta',
    naziv: 'Javna rasvjeta',
    boja: '#B07D00',
    kljucneRijeci: ['rasvjeta', 'lampa', 'sijalica', 'mrak', 'ne svijetli', 'stub'],
  },
  {
    kljuc: 'otpad',
    naziv: 'Otpad i deponije',
    boja: '#7A5230',
    kljucneRijeci: ['smeće', 'otpad', 'deponija', 'kontejner', 'kanta', 'đubre'],
  },
  {
    kljuc: 'igralista',
    naziv: 'Igrališta i parkovi',
    boja: '#C2416B',
    kljucneRijeci: ['igralište', 'ljuljačka', 'tobogan', 'klupa', 'park'],
  },
  {
    kljuc: 'prevoz',
    naziv: 'Javni prevoz',
    boja: '#1F6FB2',
    kljucneRijeci: ['autobus', 'tramvaj', 'stanica', 'kasni', 'linija', 'nadstrešnica'],
  },
  {
    kljuc: 'sigurnost',
    naziv: 'Pješački prelazi i sigurnost',
    boja: '#C8372D',
    kljucneRijeci: ['prelaz', 'zebra', 'semafor', 'brzina', 'opasno za pješake'],
  },
  {
    kljuc: 'infrastruktura',
    naziv: 'Javna infrastruktura',
    boja: '#4A5A66',
    kljucneRijeci: ['šaht', 'poklopac', 'ograda', 'most', 'kanalizacija', 'voda'],
  },
  {
    kljuc: 'okolis',
    naziv: 'Zelene površine i okoliš',
    boja: '#4E8F2A',
    kljucneRijeci: ['drvo', 'trava', 'zelena površina', 'sječa', 'zagađenje'],
  },
]

export function kategorijaPoKljucu(kljuc) {
  return KATEGORIJE.find((k) => k.kljuc === kljuc) || null
}

// Statusi prijave. "javno" kaže da li se prijava s tim statusom vidi u javnom prikazu.
export const STATUSI = {
  NA_CEKANJU: { naziv: 'Na čekanju provjere', javno: false },
  ODBIJENO: { naziv: 'Odbijeno', javno: false },
  ZAPRIMLJENO: { naziv: 'Zaprimljeno', javno: true },
  U_OBRADI: { naziv: 'U obradi', javno: true },
  // Aplikacija NIKAD ne šalje ništa službi – zato naziv uvijek nosi "(simulacija)".
  PROSLIJEDJENO: { naziv: 'Proslijeđeno službi (simulacija)', javno: true },
  RIJESENO: { naziv: 'Riješeno', javno: true },
}

// Redoslijed statusa za prijavu koja nije odbijena.
export const TOK_STATUSA = ['NA_CEKANJU', 'ZAPRIMLJENO', 'U_OBRADI', 'PROSLIJEDJENO', 'RIJESENO']

export const JAVNI_STATUSI = Object.keys(STATUSI).filter((s) => STATUSI[s].javno)

export function nazivStatusa(status) {
  return STATUSI[status] ? STATUSI[status].naziv : status
}

export const PRIORITETI = {
  nizak: 'Nizak',
  srednji: 'Srednji',
  visok: 'Visok',
}

// Naselja s PRIBLIŽNIM središtem (aproksimacija, nisu zvanične granice).
export const NASELJA = [
  { naziv: 'Ilidža centar', lat: 43.829, lng: 18.307 },
  { naziv: 'Otes', lat: 43.843, lng: 18.287 },
  { naziv: 'Stup', lat: 43.851, lng: 18.336 },
  { naziv: 'Hrasnica', lat: 43.797, lng: 18.318 },
  { naziv: 'Sokolović Kolonija', lat: 43.811, lng: 18.327 },
  { naziv: 'Butmir', lat: 43.82, lng: 18.331 },
  { naziv: 'Osijek', lat: 43.84, lng: 18.27 },
  { naziv: 'Blažuj', lat: 43.843, lng: 18.245 },
]

// Približni okvir Ilidže. Lokacija izvan okvira dobija upozorenje, ali se ne blokira.
export const OKVIR_ILIDZE = {
  minLat: 43.76,
  maxLat: 43.88,
  minLng: 18.2,
  maxLng: 18.4,
}

export const CENTAR_MAPE = { lat: 43.83, lng: 18.31 }

// Demo uloge – samo demonstracija, NISU prijava korisnika ni zaštita podataka.
export const ULOGE = {
  gost: 'Gost',
  gradjanin: 'Građanin',
  administrator: 'Administrator',
}

export const TEKST_TESTNI_PODACI =
  'Demonstracijska verzija – testni podaci, nisu stvarne prijave Općine Ilidža'
