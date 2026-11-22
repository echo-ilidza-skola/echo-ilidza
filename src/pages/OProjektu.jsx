// O projektu: šta je ECHO, šta je prototip, pravila naspram AI, demo uloge, gdje su podaci, kada radi GPS.
// Ograničenja se navode otvoreno (pravilo 11).

import { Link } from 'react-router-dom'
import Ikona from '../components/Ikona.jsx'
import { PRAG_DUPLIKATA_M } from '../data/konstante.js'
import { TESTNE_FOTOGRAFIJE } from '../data/testneFotografije.js'
import { OZNAKA_PRAVILA } from '../components/prijava/PrijedlogKategorije.jsx'

function Odjeljak({ ikona, naslov, children }) {
  return (
    <section className="projekat-odjeljak">
      <h2>
        <span className="projekat-ikona" aria-hidden="true">
          <Ikona ime={ikona} velicina={22} />
        </span>
        {naslov}
      </h2>
      {children}
    </section>
  )
}

export default function OProjektu() {
  return (
    <article className="o-projektu">
      <header className="projekat-uvod">
        <div>
          <h1>O projektu</h1>
          <p className="uvod">
            ECHO Ilidža je <strong>školski prototip</strong> aplikacije u kojoj građani prijavljuju komunalne
            probleme, prate status prijave i vide prijave na mapi. Razvijaju ga učenici Četvrte gimnazije Ilidža uz mentoricu.
          </p>
        </div>
      </header>

      <Odjeljak ikona="poruka" naslov="Zašto „ECHO“?">
        <p>
          Eho je glas koji se čuje i na koji stiže odgovor. Tako i ovdje: građanin pošalje prijavu (glas), a status
          prijave mu „odgovori“ – Na čekanju, Zaprimljeno, U obradi, Riješeno.
        </p>
        <p className="mali-tekst prigusen">ECHO možete čitati i kao „Every Citizen Has One voice“ – svaki građanin ima glas.</p>
      </Odjeljak>

      <Odjeljak ikona="info" naslov="Ovo je demonstracija">
        <ul>
          <li>
            <strong>Svi podaci su testni.</strong> Prijave na mapi su izmišljene i nisu stvarne prijave Općine Ilidža.
          </li>
          <li>
            <strong>Aplikacija ne šalje ništa Općini ni bilo kojoj instituciji.</strong> Status „Proslijeđeno službi
            (simulacija)“ je samo simulacija – nijedna služba ne dobija prijavu.
          </li>
          <li>Nema servera, nema korisničkih računa, nema analitike ni praćenja korisnika.</li>
        </ul>
      </Odjeljak>

      <Odjeljak ikona="admin" naslov="Demo uloge nisu prijava korisnika">
        <p>
          Prekidač „Demo uloga: Gost / Građanin / Administrator“ u zaglavlju služi samo da se pokaže kako aplikacija
          izgleda iz različitih uglova. <strong>To nije prijava korisnika ni zaštita podataka</strong> – svako može
          odabrati bilo koju ulogu, pa i „Administrator“.
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
      </Odjeljak>

      <Odjeljak ikona="kvacica" naslov="Pravila, a ne umjetna inteligencija">
        <p>
          Kad napišete prijavu, aplikacija predloži kategoriju i (administratoru) prioritet. Uz prijedlog uvijek piše
          „{OZNAKA_PRAVILA}“, jer to <strong>nije AI</strong>, nego jednostavna pravila koja su učenici mogli i sami
          napisati:
        </p>
        <ul>
          <li>
            <strong>Kategorija:</strong> aplikacija u naslovu i opisu traži ključne riječi (npr. „rupa“, „lampa“,
            „kontejner“) i predloži kategoriju s najviše pogodaka.
          </li>
          <li>
            <strong>Prioritet:</strong> bodovi – riječi opasnosti +3, spominjanje škole, vrtića ili igrališta +2,
            svaka povezana prijava +1. To je orijentacioni prijedlog, nije procjena stvarne opasnosti.
          </li>
          <li>
            <strong>Mogući duplikat:</strong> prijava iste kategorije bliža od {PRAG_DUPLIKATA_M} m. Aplikacija samo
            predloži povezivanje – ništa ne povezuje sama.
          </li>
        </ul>
        <p>
          <strong>Šta bi bio AI?</strong> Program koji je „učio“ na hiljadama primjera i sam procjenjuje značenje teksta
          ili sadržaj fotografije. ECHO to ne radi: <strong>ne analizira fotografije</strong> i ne šalje tekst nijednom
          vanjskom servisu. Zato pravila nekad i pogriješe – npr. riječ „kasno“ podsjeća na „kasni“ (javni prevoz).
          Zbog toga konačnu kategoriju i prioritet uvijek potvrđuje administrator.
        </p>
      </Odjeljak>

      <Odjeljak ikona="moje" naslov="Šta je javno, a šta nije">
        <ul>
          <li>Nova prijava i njena fotografija postaju javne tek kad ih administrator provjeri i odobri.</li>
          <li>Odbijena prijava nije javna; razlog odbijanja vidi samo autor u „Mojim prijavama“.</li>
          <li>Autor prijave, interna napomena administratora i predloženi prioritet nikad se ne prikazuju javno.</li>
          <li>Administrator može sakriti fotografiju iz javnog prikaza.</li>
        </ul>
      </Odjeljak>

      <Odjeljak ikona="podaci" naslov="Gdje su podaci">
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
            Fotografije se prije spremanja smanje (najviše 1024 px) i pretvore u JPEG. Time se brišu i skriveni podaci
            iz fotografije (EXIF), npr. GPS koordinate i model telefona.
          </li>
        </ul>
      </Odjeljak>

      <Odjeljak ikona="mapa" naslov="Kada radi GPS">
        <ul>
          <li>
            GPS („Koristi moju lokaciju“) radi samo na <strong>sigurnoj adresi</strong> – https:// (npr. GitHub Pages)
            ili localhost – i samo ako dozvolite pristup lokaciji.
          </li>
          <li>
            Razvojna verzija otvorena na mobitelu preko adrese računara u mreži (npr. http://192.168…) neće imati GPS.
            To nije greška aplikacije, nego pravilo preglednika.
          </li>
          <li>
            <strong>Ručni odabir lokacije uvijek radi:</strong> kliknite na mapu ili odaberite naselje.
          </li>
          <li>
            Granice Ilidže i središta naselja su približni. To nisu zvanične granice općine; lokacija izvan okvira
            dobija upozorenje, ali se ne blokira.
          </li>
        </ul>
      </Odjeljak>

      <Odjeljak ikona="admin" naslov="Kako bi radila stvarna verzija">
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
            <strong>Administratori</strong> imaju pravu prijavu s jakom lozinkom, jer vide autore, interne napomene i
            fotografije prije objave.
          </li>
          <li>
            <strong>Administrator je moderator</strong>, a ne neko ko popravlja rupe: štiti privatnost (lica,
            registarske oznake), odbija neozbiljne prijave uz razlog, potvrđuje kategoriju i prioritet, povezuje iste
            probleme i ažurira status.
          </li>
          <li>
            <strong>Ko bi bio administrator?</strong> Ili zaposlenik nadležne službe Općine (uz zvanični dogovor), ili
            posrednik – škola, mjesna zajednica ili udruženje – koji prijave prosljeđuje Općini zvaničnim putem. Tada se
            „Riješeno“ označava tek kad to potvrdi Općina ili kad građanin pošalje fotografiju popravljenog stanja.
          </li>
          <li>
            U ovom školskom prototipu administratore glume mentorica i učenici – „dežurni moderatori“.
          </li>
        </ul>
      </Odjeljak>

      <Odjeljak ikona="info" naslov="Zahvale i izvori">
        <ul>
          <li>
            Mapa: ©{' '}
            <a href="https://www.openstreetmap.org/copyright">saradnici OpenStreetMap-a</a>, prikaz pomoću biblioteke
            Leaflet; toplotna mapa pomoću dodatka Leaflet.heat (licenca BSD).
          </li>
          <li>Slika na početnoj stranici je ilustracija generisana pomoću AI, a ne stvarna fotografija Ilidže.</li>
          <li>
            Fotografije uz testne prijave nisu snimljene u Ilidži – to su slobodne fotografije s Wikimedia Commonsa,
            koje će zamijeniti fotografije učenika:
            <ul className="mali-tekst">
              {Object.values(TESTNE_FOTOGRAFIJE).map((f) => (
                <li key={f.izvor}>
                  <a href={f.izvor}>{f.autor}</a>, {f.licenca}
                </li>
              ))}
            </ul>
          </li>
          <li>Font naslova: Montserrat (licenca SIL Open Font License).</li>
          <li>Izrađeno u React-u i Vite-u; ikone i znak eha su nacrtani posebno za ovaj projekat.</li>
        </ul>
      </Odjeljak>

      <p className="projekat-kraj">
        <Link to="/mapa" className="dugme dugme-glavno">
          <Ikona ime="mapa" velicina={18} />
          Pogledaj mapu prijava
        </Link>
      </p>
    </article>
  )
}
