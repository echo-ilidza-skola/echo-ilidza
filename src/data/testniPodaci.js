// 28 IZMIŠLJENIH prijava za demonstraciju. Nijedna nije stvarna prijava Općine Ilidža.
// Tekstovi ne sadrže stvarna imena ljudi, firmi ni tačne kućne adrese.
// Datumi se računaju u odnosu na trenutak učitavanja ("danaPrije"), pa su uvijek u posljednjih 90 dana.

import { OPCINA, DEMO_KORISNIK_ID, TOK_STATUSA } from './konstante.js'
import { predloziKategoriju } from '../logic/prijedlogKategorije.js'
import { predloziPrioritet } from '../logic/prioritet.js'
import { kljucTestneFotografije } from './testneFotografije.js'

const DEMO = DEMO_KORISNIK_ID

// Skraćeni opis svake testne prijave. Ostala polja se dopunjavaju u funkciji napraviPrijavu().
const OSNOVNI_PODACI = [
  // --- Ilidža centar ---
  {
    id: 't01', naselje: 'Ilidža centar', lat: 43.8302, lng: 18.3051, danaPrije: 20,
    kategorija: 'rasvjeta', potvrdjeniPrioritet: 'srednji',
    status: 'U_OBRADI', autorId: DEMO,
    naslov: 'Ne svijetli rasvjeta u ulici prema parku',
    opis: 'Tri lampe zaredom ne svijetle već sedmicu dana. Navečer je potpuni mrak i teško se vidi trotoar.',
  },
  {
    id: 't02', naselje: 'Ilidža centar', lat: 43.8278, lng: 18.3094, danaPrije: 6,
    kategorija: 'otpad', potvrdjeniPrioritet: null,
    status: 'ZAPRIMLJENO', autorId: 'testni-korisnik-01',
    naslov: 'Prepun kontejner kod pijace',
    opis: 'Kontejner za smeće je prepun i otpad se rasipa po trotoaru. Kanta pored njega je oštećena.',
  },
  {
    id: 't03', naselje: 'Ilidža centar', lat: 43.8311, lng: 18.3112, danaPrije: 35,
    kategorija: 'prevoz', potvrdjeniPrioritet: 'srednji',
    status: 'PROSLIJEDJENO', autorId: 'testni-korisnik-02',
    naslov: 'Oštećena nadstrešnica na tramvajskoj stanici',
    opis: 'Na nadstrešnici stanice nedostaje jedno staklo. Putnici čekaju tramvaj na kiši, a ostaci stakla su bili na zemlji.',
  },
  {
    // Glavna prijava grupe A (povezane su t05 i t06).
    id: 't04', naselje: 'Ilidža centar', lat: 43.8285, lng: 18.3030, danaPrije: 25,
    kategorija: 'ceste', potvrdjeniPrioritet: 'visok',
    status: 'U_OBRADI', autorId: 'testni-korisnik-03', brojPrijavitelja: 3,
    naslov: 'Velika udarna rupa na raskrsnici',
    opis: 'Na raskrsnici kod autobuske stanice je velika udarna rupa. Automobili je naglo zaobilaze, a biciklisti moraju na sredinu ceste. Opasno je naročito noću.',
    internaNapomena: 'Testna interna napomena: dvije prijave su povezane s ovom.',
  },
  {
    id: 't05', naselje: 'Ilidža centar', lat: 43.82865, lng: 18.3030, danaPrije: 18,
    kategorija: 'ceste', potvrdjeniPrioritet: 'visok',
    status: 'ZAPRIMLJENO', autorId: 'testni-korisnik-04', glavnaPrijavaId: 't04',
    naslov: 'Rupa na cesti kod stanice',
    opis: 'Duboka rupa u asfaltu odmah pored stanice. Kad pada kiša, napuni se vodom i ne vidi se koliko je duboka.',
  },
  {
    id: 't06', naselje: 'Ilidža centar', lat: 43.8287, lng: 18.3032, danaPrije: 2,
    kategorija: 'ceste', potvrdjeniPrioritet: null,
    status: 'NA_CEKANJU', autorId: 'testni-korisnik-05', glavnaPrijavaId: 't04',
    naslov: 'Oštećen asfalt, rupa je sve veća',
    opis: 'Rupa na raskrsnici se širi i odvaljuju se komadi asfalta.',
  },

  // --- Otes ---
  {
    id: 't07', naselje: 'Otes', lat: 43.8441, lng: 18.2856, danaPrije: 70,
    kategorija: 'igralista', potvrdjeniPrioritet: 'visok',
    status: 'RIJESENO', autorId: DEMO,
    naslov: 'Polomljena ljuljačka na igralištu',
    opis: 'Na dječijem igralištu je pukao lanac na jednoj ljuljački. Djeca se i dalje ljuljaju i mogu se povrijediti.',
  },
  {
    id: 't08', naselje: 'Otes', lat: 43.8423, lng: 18.2889, danaPrije: 12,
    kategorija: 'otpad', potvrdjeniPrioritet: 'nizak',
    status: 'ZAPRIMLJENO', autorId: 'testni-korisnik-06',
    naslov: 'Nepropisno odložen otpad',
    opis: 'Na zelenoj površini između zgrada neko je ostavio kese sa smećem i stari namještaj, iako je kontejner blizu.',
  },
  {
    id: 't09', naselje: 'Otes', lat: 43.8437, lng: 18.2902, danaPrije: 40,
    kategorija: 'sigurnost', potvrdjeniPrioritet: 'visok',
    status: 'PROSLIJEDJENO', autorId: DEMO,
    naslov: 'Izblijedjela zebra kod škole',
    opis: 'Pješački prelaz ispred osnovne škole se skoro ne vidi. Vozači ne usporavaju i opasno je za pješake, posebno za djecu.',
  },
  {
    id: 't10', naselje: 'Otes', lat: 43.8409, lng: 18.2838, danaPrije: 1,
    kategorija: 'otpad', potvrdjeniPrioritet: null,
    status: 'NA_CEKANJU', autorId: 'testni-korisnik-07',
    naslov: 'Divlja deponija uz rijeku',
    opis: 'Uz obalu rijeke je nastala divlja deponija: građevinski otpad, stare gume i kese sa smećem.',
  },

  // --- Stup ---
  {
    id: 't11', naselje: 'Stup', lat: 43.8526, lng: 18.3341, danaPrije: 9,
    kategorija: 'prevoz', potvrdjeniPrioritet: null,
    status: 'ZAPRIMLJENO', autorId: DEMO,
    naslov: 'Jutarnji autobus redovno kasni',
    opis: 'Jutarnja linija prema centru kasni i po dvadeset minuta, pa djeca kasne u školu.',
  },
  {
    id: 't12', naselje: 'Stup', lat: 43.8497, lng: 18.3388, danaPrije: 4,
    kategorija: 'infrastruktura', potvrdjeniPrioritet: 'visok',
    status: 'U_OBRADI', autorId: 'testni-korisnik-08',
    naslov: 'Otvoren šaht na trotoaru',
    opis: 'Na trotoaru nedostaje poklopac šahta. Otvoren šaht je veoma opasno mjesto, neko može upasti.',
    internaNapomena: 'Testna interna napomena: hitno, provjeriti ponovo sutra.',
  },
  {
    id: 't13', naselje: 'Stup', lat: 43.8541, lng: 18.3315, danaPrije: 85,
    kategorija: 'ceste', potvrdjeniPrioritet: 'nizak',
    status: 'RIJESENO', autorId: 'testni-korisnik-09',
    naslov: 'Oštećen pločnik ispred stambenih zgrada',
    opis: 'Ploče na pločniku su izdignute i klimaju se. Starijim osobama je teško hodati.',
  },
  {
    // Glavna prijava grupe B (povezana je t15).
    id: 't14', naselje: 'Stup', lat: 43.8510, lng: 18.3375, danaPrije: 15,
    kategorija: 'rasvjeta', potvrdjeniPrioritet: 'srednji',
    status: 'ZAPRIMLJENO', autorId: 'testni-korisnik-10', brojPrijavitelja: 2,
    naslov: 'Ugašena rasvjeta na pješačkoj stazi',
    opis: 'Cijela pješačka staza uz cestu je u mraku. Nijedna lampa ne svijetli, a stazu koriste djeca na putu do vrtića.',
  },
  {
    id: 't15', naselje: 'Stup', lat: 43.8512, lng: 18.3377, danaPrije: 13,
    kategorija: 'rasvjeta', potvrdjeniPrioritet: 'srednji',
    status: 'ZAPRIMLJENO', autorId: 'testni-korisnik-11', glavnaPrijavaId: 't14',
    naslov: 'Neispravna ulična rasvjeta',
    opis: 'Na stazi uz cestu ne radi nijedna lampa. Ljudi navečer hodaju uz svjetlo mobitela.',
  },

  // --- Hrasnica ---
  {
    id: 't16', naselje: 'Hrasnica', lat: 43.7982, lng: 18.3164, danaPrije: 60,
    kategorija: 'otpad', potvrdjeniPrioritet: 'nizak',
    status: 'RIJESENO', autorId: DEMO,
    naslov: 'Kontejneri se ne prazne redovno',
    opis: 'Kontejneri kod stambenog bloka nisu ispražnjeni dvije sedmice. Oko njih se skuplja otpad.',
  },
  {
    id: 't17', naselje: 'Hrasnica', lat: 43.7961, lng: 18.3201, danaPrije: 30,
    kategorija: 'igralista', potvrdjeniPrioritet: 'srednji',
    status: 'U_OBRADI', autorId: 'testni-korisnik-12',
    naslov: 'Polomljena klupa u parku',
    opis: 'U parku je jedna klupa polomljena i iz nje vire ekseri.',
  },
  {
    id: 't18', naselje: 'Hrasnica', lat: 43.7994, lng: 18.3189, danaPrije: 22,
    kategorija: 'sigurnost', potvrdjeniPrioritet: 'visok',
    status: 'PROSLIJEDJENO', autorId: 'testni-korisnik-13',
    naslov: 'Ne radi semafor za pješake',
    opis: 'Semafor za pješake na raskrsnici već danima samo trepće žuto. Prelaz je sada opasno mjesto.',
  },
  {
    id: 't19', naselje: 'Hrasnica', lat: 43.7953, lng: 18.3148, danaPrije: 3,
    kategorija: 'okolis', potvrdjeniPrioritet: null,
    status: 'NA_CEKANJU', autorId: 'testni-korisnik-14',
    naslov: 'Suho drvo nagnuto nad stazom',
    opis: 'Veliko suho drvo se nagnulo nad pješačku stazu. Grane već otpadaju.',
  },
  {
    id: 't20', naselje: 'Hrasnica', lat: 43.7975, lng: 18.3222, danaPrije: 50,
    kategorija: 'ceste', potvrdjeniPrioritet: null,
    status: 'ODBIJENO', autorId: DEMO,
    naslov: 'Rupa',
    opis: 'Rupa negdje u naselju.',
    razlogOdbijanja: 'Prijava nema dovoljno podataka: opis i lokacija nisu dovoljno precizni. Pošaljite novu prijavu s više detalja.',
  },

  // --- Sokolović Kolonija ---
  {
    id: 't21', naselje: 'Sokolović Kolonija', lat: 43.8118, lng: 18.3256, danaPrije: 45,
    kategorija: 'infrastruktura', potvrdjeniPrioritet: 'srednji',
    status: 'RIJESENO', autorId: 'testni-korisnik-15',
    naslov: 'Oštećena ograda na pješačkom mostu',
    opis: 'Na pješačkom mostu preko potoka nedostaje dio ograde. Opasno je za djecu koja tuda prolaze.',
  },
  {
    id: 't22', naselje: 'Sokolović Kolonija', lat: 43.8097, lng: 18.3291, danaPrije: 27,
    kategorija: 'prevoz', potvrdjeniPrioritet: 'nizak',
    status: 'ZAPRIMLJENO', autorId: 'testni-korisnik-16',
    naslov: 'Na stanici nema klupe ni nadstrešnice',
    opis: 'Na autobuskoj stanici nema gdje sjesti ni gdje se skloniti od kiše.',
  },
  {
    id: 't23', naselje: 'Sokolović Kolonija', lat: 43.8126, lng: 18.3302, danaPrije: 33,
    kategorija: 'okolis', potvrdjeniPrioritet: null,
    status: 'ODBIJENO', autorId: 'testni-korisnik-17',
    naslov: 'Glasna muzika navečer',
    opis: 'Iz jednog stana se u noćnim satima čuje glasna muzika.',
    razlogOdbijanja: 'Prijava se ne odnosi na komunalni problem javnog prostora koji je obuhvaćen ovom aplikacijom.',
  },

  // --- Butmir ---
  {
    id: 't24', naselje: 'Butmir', lat: 43.8212, lng: 18.3297, danaPrije: 55,
    kategorija: 'infrastruktura', potvrdjeniPrioritet: 'srednji',
    status: 'PROSLIJEDJENO', autorId: 'testni-korisnik-18',
    naslov: 'Kanalizacija se izlijeva na cestu',
    opis: 'Nakon svake kiše iz šahta izlazi voda iz kanalizacije i teče niz cestu.',
  },
  {
    id: 't25', naselje: 'Butmir', lat: 43.8189, lng: 18.3328, danaPrije: 0,
    kategorija: 'igralista', potvrdjeniPrioritet: null,
    status: 'NA_CEKANJU', autorId: DEMO,
    naslov: 'Tobogan ima oštre ivice',
    opis: 'Na toboganu u parku blizu vrtića je napukla plastika i ima oštre ivice.',
  },

  // --- Osijek ---
  {
    id: 't26', naselje: 'Osijek', lat: 43.8408, lng: 18.2713, danaPrije: 88,
    kategorija: 'sigurnost', potvrdjeniPrioritet: 'srednji',
    status: 'RIJESENO', autorId: 'testni-korisnik-19',
    naslov: 'Vozila prebrzo voze kroz naselje',
    opis: 'Kroz naselje automobili voze velikom brzinom, a nema usporivača. Opasno za pješake.',
  },
  {
    id: 't27', naselje: 'Osijek', lat: 43.8386, lng: 18.2681, danaPrije: 16,
    kategorija: 'rasvjeta', potvrdjeniPrioritet: null,
    status: 'ODBIJENO', autorId: 'testni-korisnik-20',
    naslov: 'Lampa ne svijetli',
    opis: 'Jedna lampa ne svijetli.',
    razlogOdbijanja: 'Iz opisa i lokacije nije moguće utvrditi o kojoj se lampi radi. Pošaljite novu prijavu s tačnijom lokacijom.',
  },

  // --- Blažuj ---
  {
    id: 't28', naselje: 'Blažuj', lat: 43.8434, lng: 18.2467, danaPrije: 75,
    kategorija: 'otpad', potvrdjeniPrioritet: 'nizak',
    status: 'RIJESENO', autorId: 'testni-korisnik-21',
    naslov: 'Smeće pored puta prema naselju',
    opis: 'Pored puta prema naselju neko je ostavio vreće sa smećem i stari namještaj.',
  },
]

const DAN_MS = 24 * 60 * 60 * 1000

// Napomene koje idu uz pojedine statuse u historiji testnih prijava.
const NAPOMENE_STATUSA = {
  ZAPRIMLJENO: 'Prijava je provjerena i odobrena (testni podatak).',
  PROSLIJEDJENO: 'Simulirani korak – aplikacija ne šalje ništa nijednoj službi.',
  RIJESENO: 'Označeno kao riješeno (testni podatak).',
}

// Pravi historiju statusa: koraci su ravnomjerno raspoređeni između
// datuma prijave i 80 % vremena koje je prošlo od tada.
function napraviHistoriju(osnova, datumPrijave, sada) {
  const pocetak = new Date(datumPrijave).getTime()
  const proteklo = (sada.getTime() - pocetak) * 0.8

  if (osnova.status === 'ODBIJENO') {
    return [
      { status: 'NA_CEKANJU', datum: datumPrijave },
      {
        status: 'ODBIJENO',
        datum: new Date(pocetak + proteklo * 0.3).toISOString(),
        napomena: osnova.razlogOdbijanja,
      },
    ]
  }

  const koraci = TOK_STATUSA.slice(0, TOK_STATUSA.indexOf(osnova.status) + 1)
  return koraci.map((status, i) => {
    const korak = { status, datum: new Date(pocetak + (proteklo * i) / koraci.length).toISOString() }
    if (NAPOMENE_STATUSA[status]) korak.napomena = NAPOMENE_STATUSA[status]
    return korak
  })
}

// Dopunjava skraćeni zapis do pune prijave prema modelu podataka.
function napraviPrijavu(osnova, redniBroj, sada) {
  // Svaka prijava dobija drugačiji sat u danu, da datumi ne budu svi u ponoć.
  const sati = 8 + (redniBroj % 10)
  const datum = new Date(sada.getTime() - osnova.danaPrije * DAN_MS)
  datum.setHours(sati, (redniBroj * 7) % 60, 0, 0)
  if (datum > sada) datum.setTime(sada.getTime() - 60 * 60 * 1000)
  const datumPrijave = datum.toISOString()

  // Prijedlozi se računaju ISTIM pravilima kao za nove prijave (pravila, ne AI).
  // Za glavnu prijavu broj povezanih = broj prijavitelja - 1.
  const brojPovezanih = (osnova.brojPrijavitelja || 1) - 1
  const prijedlogKategorije = predloziKategoriju(osnova.naslov, osnova.opis)
  const prijedlogPrioriteta = predloziPrioritet(osnova.naslov, osnova.opis, brojPovezanih)

  return {
    id: osnova.id,
    opcina: OPCINA,
    naslov: osnova.naslov,
    opis: osnova.opis,
    kategorija: osnova.kategorija,
    predlozenaKategorija: prijedlogKategorije.kategorija,
    predlozeniPrioritet: prijedlogPrioriteta.prioritet,
    potvrdjeniPrioritet: osnova.potvrdjeniPrioritet,
    naselje: osnova.naselje,
    lat: osnova.lat,
    lng: osnova.lng,
    // Neke testne prijave imaju slobodnu fotografiju s Wikimedije (vidi testneFotografije.js).
    fotografijaId: kljucTestneFotografije(osnova.id),
    fotografijaSkrivena: false,
    datumPrijave,
    status: osnova.status,
    historijaStatusa: napraviHistoriju(osnova, datumPrijave, sada),
    razlogOdbijanja: osnova.razlogOdbijanja || null,
    internaNapomena: osnova.internaNapomena || '',
    glavnaPrijavaId: osnova.glavnaPrijavaId || null,
    brojPrijavitelja: osnova.brojPrijavitelja || 1,
    autorId: osnova.autorId,
    testniPodatak: true,
  }
}

// Vraća NOVU listu svih 28 testnih prijava (svaki put svježe kopije).
export function napraviTestnePodatke(sada = new Date()) {
  return OSNOVNI_PODACI.map((osnova, i) => napraviPrijavu(osnova, i, sada))
}
