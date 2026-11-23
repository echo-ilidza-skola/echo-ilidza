// Sadržaj ekrana "O projektu" na oba jezika. Tekst je dugačak i ima istaknute dijelove (<strong>),
// pa je lakše čitati i mijenjati ga ovako, kao cijele odjeljke, nego kao desetine ključeva u rječniku.
// Ako mijenjate jedan jezik, promijenite i drugi, da kažu isto.

import { PRAG_DUPLIKATA_M } from '../data/konstante.js'
import { prevedi } from '../jezik/prevodi.js'

// Svaki odjeljak: { ikona, naslov, tijelo (JSX) }.
export function sadrzajOProjektu(jezik) {
  const oznakaPravila = prevedi(jezik, 'pravila.oznaka')
  return jezik === 'en' ? sadrzajEn(oznakaPravila) : sadrzajBs(oznakaPravila)
}

function sadrzajBs(oznakaPravila) {
  return {
    naslov: 'O projektu',
    uvod: (
      <>
        ECHO Ilidža je <strong>školski prototip</strong> aplikacije u kojoj građani prijavljuju komunalne probleme,
        prate status prijave i vide prijave na mapi. Razvijaju ga učenici Četvrte gimnazije Ilidža sa profesoricom
        Abdić Sevletom.
      </>
    ),
    odjeljci: [
      {
        ikona: 'poruka',
        naslov: 'Zašto „ECHO“?',
        tijelo: (
          <>
            <p>
              Eho je glas koji se čuje i na koji stiže odgovor. Tako i ovdje: građanin pošalje prijavu (glas), a
              status prijave mu „odgovori“ – Na čekanju, Zaprimljeno, U obradi, Riješeno.
            </p>
            <p className="mali-tekst prigusen">
              ECHO možete čitati i kao „Every Citizen Has One voice“ – svaki građanin ima glas.
            </p>
          </>
        ),
      },
      {
        ikona: 'info',
        naslov: 'Ovo je demonstracija',
        tijelo: (
          <ul>
            <li>
              <strong>Svi podaci su testni.</strong> Prijave na mapi su izmišljene i nisu stvarne prijave Općine
              Ilidža.
            </li>
            <li>
              <strong>Aplikacija ne šalje ništa Općini ni bilo kojoj instituciji.</strong> Status „Proslijeđeno službi
              (simulacija)“ je samo simulacija – nijedna služba ne dobija prijavu.
            </li>
            <li>Nema servera, nema korisničkih računa, nema analitike ni praćenja korisnika.</li>
            <li>Slika na početnoj stranici je privremena ilustracija napravljena pomoću AI, a ne fotografija Ilidže.</li>
          </ul>
        ),
      },
      {
        ikona: 'admin',
        naslov: 'Demo uloge nisu prijava korisnika',
        tijelo: (
          <>
            <p>
              Ikona osobe u zaglavlju (meni „Demo uloga“: Gost / Građanin / Administrator) služi samo da se pokaže
              kako aplikacija izgleda iz različitih uglova. <strong>To nije prijava korisnika ni zaštita podataka</strong>{' '}
              – svako može odabrati bilo koju ulogu, pa i „Administrator“.
            </p>
            <ul>
              <li>
                <strong>Gost</strong> vidi javne ekrane: početnu, mapu, detalje odobrenih prijava i ovu stranicu.
              </li>
              <li>
                <strong>Građanin</strong> (jedan izmišljeni demo korisnik) šalje prijave i vidi „Moje prijave“.
              </li>
              <li>
                <strong>Administrator</strong> odobrava i odbija prijave, mijenja status, piše napomene i povezuje
                prijave istog problema.
              </li>
            </ul>
          </>
        ),
      },
      {
        ikona: 'kvacica',
        naslov: 'Pravila, a ne umjetna inteligencija',
        tijelo: (
          <>
            <p>
              Kad napišete prijavu, aplikacija predloži kategoriju i (administratoru) prioritet. Uz prijedlog uvijek
              piše „{oznakaPravila}“, jer to <strong>nije AI</strong>, nego jednostavna pravila koja su učenici mogli
              i sami napisati:
            </p>
            <ul>
              <li>
                <strong>Kategorija:</strong> aplikacija u naslovu i opisu traži ključne riječi (npr. „rupa“, „lampa“,
                „kontejner“, a i engleske riječi poput „pothole“) i predloži kategoriju s najviše pogodaka.
              </li>
              <li>
                <strong>Prioritet:</strong> bodovi – riječi opasnosti +3, spominjanje škole, vrtića ili igrališta +2,
                svaka povezana prijava +1. To je orijentacioni prijedlog, nije procjena stvarne opasnosti.
              </li>
              <li>
                <strong>Mogući duplikat:</strong> prijava iste kategorije bliža od {PRAG_DUPLIKATA_M} m. Aplikacija
                samo predloži povezivanje – ništa ne povezuje sama.
              </li>
            </ul>
            <p>
              <strong>Šta bi bio AI?</strong> Program koji je „učio“ na hiljadama primjera i sam procjenjuje značenje
              teksta ili sadržaj fotografije. ECHO to ne radi: <strong>ne analizira fotografije</strong> i ne šalje
              tekst nijednom vanjskom servisu. Zato pravila nekad i pogriješe – npr. riječ „kasno“ podsjeća na „kasni“
              (javni prevoz). Zbog toga konačnu kategoriju i prioritet uvijek potvrđuje administrator.
            </p>
          </>
        ),
      },
      {
        ikona: 'moje',
        naslov: 'Šta je javno, a šta nije?',
        tijelo: (
          <ul>
            <li>Nova prijava i njena fotografija postaju javne tek kad ih administrator provjeri i odobri.</li>
            <li>Odbijena prijava nije javna; razlog odbijanja vidi samo autor u „Mojim prijavama“.</li>
            <li>Autor prijave, interna napomena administratora i predloženi prioritet nikad se ne prikazuju javno.</li>
            <li>Administrator može sakriti fotografiju iz javnog prikaza.</li>
          </ul>
        ),
      },
      {
        ikona: 'podaci',
        naslov: 'Gdje su podaci?',
        tijelo: (
          <ul>
            <li>
              <strong>Podaci postoje samo u ovom pregledniku, na ovom uređaju.</strong> Nema zajedničke baze: prijava
              napravljena na jednom računaru ne vidi se na drugom.
            </li>
            <li>
              Ako obrišete podatke preglednika, nestaju i nove prijave i fotografije, a aplikacija ponovo učita 28
              testnih prijava.
            </li>
            <li>
              Fotografije se prije spremanja smanje (najviše 1024 px) i pretvore u JPEG. Time se brišu i skriveni
              podaci iz fotografije (EXIF), npr. GPS koordinate i model telefona.
            </li>
            <li>Izabrani jezik (BS ili EN) pamti se u ovom pregledniku. Sadržaj prijava se ne prevodi.</li>
          </ul>
        ),
      },
      {
        ikona: 'mapa',
        naslov: 'Kada radi GPS?',
        tijelo: (
          <ul>
            <li>
              GPS („Koristi moju lokaciju“ i „Prikaži moju lokaciju“ na mapi) radi samo na{' '}
              <strong>sigurnoj adresi</strong> – https:// (npr. GitHub Pages) ili localhost – i samo ako dozvolite
              pristup lokaciji. Lokacija se ne sprema i ne šalje nikome.
            </li>
            <li>
              Razvojna verzija otvorena na mobitelu preko adrese računara u mreži (npr. http://192.168…) neće imati
              GPS. To nije greška aplikacije, nego pravilo preglednika.
            </li>
            <li>
              <strong>Ručni odabir lokacije uvijek radi:</strong> kliknite na mapu ili odaberite naselje.
            </li>
            <li>
              Granice Ilidže i središta naselja su približni. To nisu zvanične granice općine; lokacija izvan okvira
              dobija upozorenje, ali se ne blokira.
            </li>
          </ul>
        ),
      },
      {
        ikona: 'admin',
        naslov: 'Kako bi radila stvarna verzija?',
        tijelo: (
          <>
            <p>
              Ovaj prototip namjerno nema prijavu korisnika: bez servera bi to bila lažna zaštita, a učenici ne trebaju
              ostavljati e-mailove ni lozinke. Kad bi ECHO jednog dana stvarno radio, predlažemo:
            </p>
            <ul>
              <li>
                <strong>Građani</strong> prijavljuju i bez korisničkog računa; ko želi pratiti status, ostavi e-mail i
                dobije link za praćenje (bez lozinke).
              </li>
              <li>
                <strong>Administratori</strong> imaju pravu prijavu s jakom lozinkom, jer vide autore, interne napomene
                i fotografije prije objave.
              </li>
              <li>
                <strong>Administrator je moderator</strong>, a ne neko ko popravlja rupe: štiti privatnost (lica,
                registarske oznake), odbija neozbiljne prijave uz razlog, potvrđuje kategoriju i prioritet, povezuje iste
                probleme i ažurira status.
              </li>
              <li>
                <strong>Ko bi bio administrator?</strong> Ili zaposlenik nadležne službe Općine (uz zvanični dogovor),
                ili posrednik – škola, mjesna zajednica ili udruženje – koji prijave prosljeđuje Općini zvaničnim putem.
                Tada se „Riješeno“ označava tek kad to potvrdi Općina ili kad građanin pošalje fotografiju popravljenog
                stanja.
              </li>
              <li>U ovom školskom prototipu administratore glume mentorica i učenici – „dežurni moderatori“.</li>
            </ul>
          </>
        ),
      },
    ],
    dugme: 'Pogledaj mapu prijava',
  }
}

function sadrzajEn(oznakaPravila) {
  return {
    naslov: 'About',
    uvod: (
      <>
        ECHO Ilidža is a <strong>school prototype</strong> of an app in which citizens report local problems, follow
        the status of their report and see reports on a map. It is being developed by students of the Fourth
        Gymnasium Ilidža (Četvrta gimnazija Ilidža) with their teacher Sevleta Abdić.
      </>
    ),
    odjeljci: [
      {
        ikona: 'poruka',
        naslov: 'Why “ECHO”?',
        tijelo: (
          <>
            <p>
              An echo is a voice that is heard and gets an answer. It works the same way here: a citizen sends a report
              (the voice), and the report status “answers” – Awaiting review, Received, In progress, Resolved.
            </p>
            <p className="mali-tekst prigusen">ECHO can also be read as “Every Citizen Has One voice”.</p>
          </>
        ),
      },
      {
        ikona: 'info',
        naslov: 'This is a demonstration',
        tijelo: (
          <ul>
            <li>
              <strong>All data is test data.</strong> The reports on the map are made up and are not real reports to
              the Municipality of Ilidža.
            </li>
            <li>
              <strong>The app sends nothing to the Municipality or any other institution.</strong> The status
              “Forwarded to the service (simulation)” is only a simulation – no service receives the report.
            </li>
            <li>There is no server, no user accounts, no analytics and no user tracking.</li>
            <li>The picture on the home page is a temporary illustration made with AI, not a photo of Ilidža.</li>
          </ul>
        ),
      },
      {
        ikona: 'admin',
        naslov: 'Demo roles are not a user login',
        tijelo: (
          <>
            <p>
              The person icon in the header (the “Demo role” menu: Guest / Citizen / Administrator) only shows how the
              app looks from different points of view. <strong>It is not a user login or data protection</strong> –
              anyone can choose any role, even “Administrator”.
            </p>
            <ul>
              <li>
                <strong>Guest</strong> sees the public screens: home, map, details of approved reports and this page.
              </li>
              <li>
                <strong>Citizen</strong> (one made-up demo user) sends reports and sees “My reports”.
              </li>
              <li>
                <strong>Administrator</strong> approves and rejects reports, changes the status, writes notes and links
                reports of the same problem.
              </li>
            </ul>
          </>
        ),
      },
      {
        ikona: 'kvacica',
        naslov: 'Rules, not artificial intelligence',
        tijelo: (
          <>
            <p>
              When you write a report, the app suggests a category and (to the administrator) a priority. The
              suggestion is always labelled “{oznakaPravila}”, because it is <strong>not AI</strong>, but simple rules
              that students could write themselves:
            </p>
            <ul>
              <li>
                <strong>Category:</strong> the app looks for keywords in the title and description (e.g. “pothole”,
                “lamp”, “container”, and also Bosnian words such as “rupa”) and suggests the category with the most
                matches.
              </li>
              <li>
                <strong>Priority:</strong> points – danger words +3, mentioning a school, kindergarten or playground +2,
                each linked report +1. It is an indicative suggestion, not an assessment of real danger.
              </li>
              <li>
                <strong>Possible duplicate:</strong> a report of the same category closer than {PRAG_DUPLIKATA_M} m.
                The app only suggests linking – it never links anything by itself.
              </li>
            </ul>
            <p>
              <strong>What would AI be?</strong> A program that “learned” from thousands of examples and estimates the
              meaning of a text or the content of a photo by itself. ECHO does not do that: it{' '}
              <strong>does not analyse photos</strong> and does not send text to any outside service. That is why the
              rules are sometimes wrong. This is why an administrator always confirms the final category and priority.
            </p>
          </>
        ),
      },
      {
        ikona: 'moje',
        naslov: 'What is public and what is not?',
        tijelo: (
          <ul>
            <li>A new report and its photo become public only after an administrator reviews and approves them.</li>
            <li>A rejected report is not public; only the author sees the reason in “My reports”.</li>
            <li>The author of a report, the administrator’s internal note and the suggested priority are never shown publicly.</li>
            <li>An administrator can hide a photo from the public view.</li>
          </ul>
        ),
      },
      {
        ikona: 'podaci',
        naslov: 'Where is the data?',
        tijelo: (
          <ul>
            <li>
              <strong>The data exists only in this browser, on this device.</strong> There is no shared database: a
              report made on one computer is not visible on another.
            </li>
            <li>
              If you clear the browser data, new reports and photos disappear too, and the app loads the 28 test
              reports again.
            </li>
            <li>
              Before saving, photos are resized (at most 1024 px) and converted to JPEG. This also removes hidden data
              from the photo (EXIF), e.g. GPS coordinates and the phone model.
            </li>
            <li>The chosen language (BS or EN) is remembered in this browser. The content of reports is not translated.</li>
          </ul>
        ),
      },
      {
        ikona: 'mapa',
        naslov: 'When does GPS work?',
        tijelo: (
          <ul>
            <li>
              GPS (“Use my location” and “Show my location” on the map) works only on a <strong>secure address</strong>{' '}
              – https:// (e.g. GitHub Pages) or localhost – and only if you allow access to your location. The location
              is not saved or sent to anyone.
            </li>
            <li>
              A development version opened on a phone through the computer’s network address (e.g. http://192.168…) will
              not have GPS. This is not an error in the app, but a browser rule.
            </li>
            <li>
              <strong>Choosing the location by hand always works:</strong> click on the map or select a neighbourhood.
            </li>
            <li>
              The borders of Ilidža and the centres of neighbourhoods are approximate. They are not official municipal
              borders; a location outside the area gets a warning, but is not blocked.
            </li>
          </ul>
        ),
      },
      {
        ikona: 'admin',
        naslov: 'How would a real version work?',
        tijelo: (
          <>
            <p>
              This prototype deliberately has no user login: without a server it would be fake protection, and students
              should not have to leave e-mail addresses or passwords. If ECHO were to work for real one day, we suggest:
            </p>
            <ul>
              <li>
                <strong>Citizens</strong> report without a user account; anyone who wants to follow the status leaves an
                e-mail and gets a tracking link (no password).
              </li>
              <li>
                <strong>Administrators</strong> have a real login with a strong password, because they see authors,
                internal notes and photos before publication.
              </li>
              <li>
                <strong>The administrator is a moderator</strong>, not someone who fixes potholes: they protect privacy
                (faces, licence plates), reject frivolous reports with a reason, confirm the category and priority, link
                identical problems and update the status.
              </li>
              <li>
                <strong>Who would be the administrator?</strong> Either an employee of the responsible municipal service
                (with an official agreement), or an intermediary – a school, local community or association – that
                forwards reports to the Municipality through official channels. “Resolved” would then be marked only when
                the Municipality confirms it or a citizen sends a photo of the repaired state.
              </li>
              <li>In this school prototype, the teacher and students act as administrators – “moderators on duty”.</li>
            </ul>
          </>
        ),
      },
    ],
    dugme: 'View the map of reports',
  }
}
