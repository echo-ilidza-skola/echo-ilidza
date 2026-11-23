// Pravila za administraciju (čiste funkcije – ništa ne spremaju, samo vraćaju nove podatke).

import { JAVNI_STATUSI, PRIORITETI, kategorijaPoKljucu, nazivStatusa } from '../data/konstante.js'
import { predloziPrioritet } from './prioritet.js'
import { napraviGresku } from '../jezik/greska.js'
import { prevedi } from '../jezik/prevodi.js'

// Uz "Proslijeđeno službi" uvijek piše da je to SIMULACIJA (aplikacija ne šalje ništa nikome).
export const NAPOMENA_SIMULACIJA = 'Simulirani korak – aplikacija ne šalje ništa nijednoj službi.'

// Napomena iz historije statusa za prikaz na izabranom jeziku: sistemska napomena o simulaciji se prevede,
// a napomenu koju je napisao administrator prikazujemo onako kako je napisana (to je sadržaj).
export function napomenaZaPrikaz(napomena, jezik = 'bs') {
  if (!napomena) return napomena
  return napomena.replace(NAPOMENA_SIMULACIJA, prevedi(jezik, 'napomene.simulacija'))
}

// U koje statuse administrator smije prebaciti prijavu iz trenutnog statusa.
//   Na čekanju → Zaprimljeno (odobri) ili Odbijeno (odbij, uz razlog)
//   Odbijeno → Na čekanju (ponovna provjera)
//   Javni statusi → bilo koji drugi javni status (i ispravka greške unazad)
export function dozvoljeniStatusi(trenutni) {
  if (trenutni === 'NA_CEKANJU') return ['ZAPRIMLJENO', 'ODBIJENO']
  if (trenutni === 'ODBIJENO') return ['NA_CEKANJU']
  if (JAVNI_STATUSI.includes(trenutni)) return JAVNI_STATUSI.filter((s) => s !== trenutni)
  return []
}

// Vraća NOVU prijavu s promijenjenim statusom i novim korakom u historiji.
// Napomena uz korak je javna (vidi se u historiji statusa kad je prijava javna).
export function promijeniStatus(prijava, noviStatus, { napomena = '', sada = new Date() } = {}) {
  if (!dozvoljeniStatusi(prijava.status).includes(noviStatus)) {
    throw napraviGresku('greske.promjenaStatusa', { od: `@statusi.${prijava.status}`, u: `@statusi.${noviStatus}` })
  }
  const tekst = (napomena || '').trim()
  if (noviStatus === 'ODBIJENO' && !tekst) {
    throw napraviGresku('greske.razlogObavezan')
  }

  let napomenaKoraka = tekst
  if (noviStatus === 'PROSLIJEDJENO') {
    napomenaKoraka = tekst ? `${tekst} (${NAPOMENA_SIMULACIJA})` : NAPOMENA_SIMULACIJA
  }

  const korak = { status: noviStatus, datum: sada.toISOString() }
  if (napomenaKoraka) korak.napomena = napomenaKoraka

  return {
    ...prijava,
    status: noviStatus,
    historijaStatusa: [...(prijava.historijaStatusa || []), korak],
    // Razlog odbijanja postoji samo dok je prijava odbijena.
    razlogOdbijanja: noviStatus === 'ODBIJENO' ? tekst : null,
  }
}

// Administrator potvrđuje (ili mijenja) konačnu kategoriju i prioritet.
// Prijedlozi pravila (predlozenaKategorija, predlozeniPrioritet) ostaju sačuvani.
export function potvrdiKategorijuIPrioritet(prijava, kategorija, prioritet) {
  if (!kategorijaPoKljucu(kategorija)) throw napraviGresku('greske.kategorija')
  if (!PRIORITETI[prioritet]) throw napraviGresku('greske.prioritet')
  return { ...prijava, kategorija, potvrdjeniPrioritet: prioritet }
}

// ---------- povezivanje prijava ----------

// Id glavne prijave grupe kojoj prijava pripada (ili njen vlastiti id ako je sama glavna).
export function idGlavneGrupe(prijave, id) {
  const p = prijave.find((x) => x.id === id)
  return p && p.glavnaPrijavaId ? p.glavnaPrijavaId : id
}

// Glavna prijava dobija broj prijavitelja = 1 + broj povezanih, i novi predloženi prioritet
// (svaka povezana prijava +1). Potvrđeni prioritet administratora se ne dira.
function preracunajGrupu(prijave, glavnaId) {
  const brojPovezanih = prijave.filter((p) => p.glavnaPrijavaId === glavnaId).length
  return prijave.map((p) =>
    p.id === glavnaId
      ? {
          ...p,
          brojPrijavitelja: 1 + brojPovezanih,
          predlozeniPrioritet: predloziPrioritet(p.naslov, p.opis, brojPovezanih).prioritet,
        }
      : p,
  )
}

// Ručno povezivanje: prijava "id" postaje dio grupe prijave "saId".
// Ako je "id" već imala svoje povezane prijave, i one prelaze u novu grupu.
export function poveziPrijave(prijave, id, saId) {
  const prijava = prijave.find((p) => p.id === id)
  const glavnaId = idGlavneGrupe(prijave, saId)
  const glavna = prijave.find((p) => p.id === glavnaId)
  if (!prijava || !glavna) throw napraviGresku('greske.nemaPrijave')
  if (glavnaId === id) throw napraviGresku('greske.samaSaSobom')
  if (prijava.kategorija !== glavna.kategorija) {
    throw napraviGresku('greske.istaKategorija')
  }

  const staraGlavnaId = prijava.glavnaPrijavaId
  let nove = prijave.map((p) => {
    if (p.id === id) return { ...p, glavnaPrijavaId: glavnaId, brojPrijavitelja: 1 }
    if (p.glavnaPrijavaId === id) return { ...p, glavnaPrijavaId: glavnaId }
    return p
  })
  nove = preracunajGrupu(nove, glavnaId)
  if (staraGlavnaId && staraGlavnaId !== glavnaId) nove = preracunajGrupu(nove, staraGlavnaId)
  return nove
}

// Razdvajanje: povezana prijava ponovo postaje samostalna.
export function razdvojiPrijave(prijave, id) {
  const prijava = prijave.find((p) => p.id === id)
  if (!prijava) throw napraviGresku('greske.nemaPrijave')
  if (!prijava.glavnaPrijavaId) throw napraviGresku('greske.nijePovezana')
  const staraGlavnaId = prijava.glavnaPrijavaId
  const nove = prijave.map((p) => (p.id === id ? { ...p, glavnaPrijavaId: null, brojPrijavitelja: 1 } : p))
  return preracunajGrupu(nove, staraGlavnaId)
}

// ---------- filteri za listu svih prijava ----------

// filteri: { status, kategorija, naselje, tekst } – prazna vrijednost znači "sve".
export function filtrirajZaAdmina(prijave, filteri) {
  const trazi = (filteri.tekst || '').trim().toLowerCase()
  return prijave.filter(
    (p) =>
      (!filteri.status || p.status === filteri.status) &&
      (!filteri.kategorija || p.kategorija === filteri.kategorija) &&
      (!filteri.naselje || p.naselje === filteri.naselje) &&
      (!trazi || `${p.naslov} ${p.opis} ${p.id}`.toLowerCase().includes(trazi)),
  )
}
