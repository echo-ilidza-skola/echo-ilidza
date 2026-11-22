# ECHO Ilidža (Faza 1: školski prototip)

## Šta je projekat
ECHO je web aplikacija u kojoj građani prijavljuju komunalne probleme (rupe na cesti, rasvjeta,
otpad, igrališta…), prate status prijave i vide prijave na mapi. Ovo je ŠKOLSKI PROTOTIP koji
razvijaju učenici Četvrte gimnazije Ilidža uz mentoricu. Pilot-područje je Općina Ilidža (Kanton Sarajevo).
Naziv: "ECHO Ilidža". Podnaslov: "Glas građana koji se čuje".
Ideja imena: eho je glas koji se čuje i na koji stiže odgovor (građanin prijavi, a status mu odgovori).
Akronim "Every Citizen Has One voice" može se spomenuti samo kao sitni detalj na ekranu O projektu.

## Nepregovorna pravila
1. Aplikacija NIKAD ne komunicira s Općinom ni sa bilo kojom institucijom i to nigdje ne sugeriše.
2. Svi podaci su testni. Na SVAKOM ekranu je vidljiva traka:
   "Demonstracijska verzija – testni podaci, nisu stvarne prijave Općine Ilidža".
3. Status "Proslijeđeno službi" uvijek nosi oznaku "(simulacija)".
4. Prijedlozi kategorije i prioriteta su PRAVILA, ne AI. U UI uvijek piše:
   "Prijedlog na osnovu ključnih riječi (pravila, ne AI)". Aplikacija nikad ne tvrdi da je analizirala fotografiju.
5. Konačnu kategoriju i prioritet potvrđuje administrator. Čuvaju se i prijedlog i potvrđena vrijednost.
6. Nijedna prijava nije javna dok je administrator ne odobri.
7. Autor prijave, interna napomena i predloženi prioritet NIKAD se ne prikazuju u javnom prikazu.
8. Nema pozadinskog servera, nema API ključeva, nema vanjskih AI servisa, nema analitike ni praćenja.
9. Ne preuzimaj slike s interneta. Testne prijave nemaju fotografije ili koriste neutralnu ikonu kategorije.
   Jedini izuzetak (odobrila mentorica): slika za hero dio (`src/assets/hero-ilidza-ai.jpg`), AI ilustracija
   koju je napravila mentorica, uz vidljivu oznaku „ilustracija generisana pomoću AI“ (podnožje); izvor je
   zapisan u `src/assets/IZVORI.md`. Privremena je – zamijenit će je fotografija koju snime učenici.
10. Demo uloge (Gost / Građanin / Administrator) NISU prijava korisnika ni zaštita podataka. Uz prekidač
    vidljivo piše „Demo verzija“ (odluka mentorice), a puna napomena je u oblačiću i za čitač ekrana;
    detaljno objašnjenje je na ekranu O projektu i na ekranima za koje treba druga uloga.
11. Nikad ne prikazuj nedovršenu ili neprovjerenu funkciju kao završenu. Greške i ograničenja se navode, ne skrivaju.

## Tehnologije
- React + Vite (JavaScript, ne TypeScript, radi čitljivosti za učenike)
- react-router-dom s HashRouter (radi objave na GitHub Pages)
- Leaflet + react-leaflet, OpenStreetMap pločice s obaveznom atribucijom; poštuj OSM pravila korištenja
  pločica (bez masovnog preuzimanja i predučitavanja pločica)
- leaflet.heat za toplotnu mapu
- idb-keyval za fotografije u IndexedDB; ostali podaci u localStorage
- Vitest za testove logike
- @fontsource/montserrat za font naslova (odobreno)
- Bez UI biblioteka (bez Tailwinda, MUI…): običan CSS s CSS varijablama, da učenici razumiju svaki red
- Ne dodaji druge biblioteke bez pitanja

## Stil koda
- Kod mora biti čitljiv učenicima: kratke funkcije, jasna imena, komentari na bosanskom gdje logika nije očita.
- Imena polja podataka su na bosanskom, bez dijakritika (vidi model podataka). Ostala imena mogu biti na engleskom.
- Sav tekst u interfejsu je na bosanskom jeziku, ijekavica, s pravilnim dijakriticima (č, ć, š, ž, đ).
- Sav pristup podacima ide ISKLJUČIVO kroz `src/data/storage.js`. Komponente nikad ne diraju localStorage direktno.
  (U kasnijim fazama ovaj modul se zamjenjuje pozivima na server.)
- Čista logika (haversine, prijedlozi, prioritet, statistika) živi u `src/logic/` bez React koda i ima Vitest testove.

## Vizuelni identitet
(Ažurirano nakon etape 3: inovativan i upečatljiv stil po uzoru na mockup koji je odobrila mentorica.)
- Tamna podloga (zaglavlje, hero, podnožje, donja navigacija): #0F2E25; primarna #1F7A63, tamnija #14523F
- Akcent limeta #B4F04A: dugmad za glavnu radnju, aktivna stavka navigacije, isticanje u naslovima.
  Tekst NA limeti je uvijek tamni (#0F2E25); limeta se ne koristi za tekst na svijetloj podlozi (slab kontrast).
- Sadržaj na svijetloj podlozi #EEF5F2 i bijelim karticama; tekst #22302C, prigušeni #5E6B66, linije #D5DFDA,
  upozorenje #B9731F na #FBF3E7
- Naslovi: Montserrat (paket @fontsource/montserrat, licenca OFL, odobrila mentorica), debljine 800 i 900,
  samo latinica (latin + latin-ext); font je u projektu, bez Google servera. Baner u hero dijelu velikim slovima.
  Ostali tekst: sistemski sans-serif.
- Gradijent i sjaj (glow) dozvoljeni SAMO kao ukras u hero dijelu i zaglavlju. Kartice imaju tanak obrub;
  kartice početne stranice smiju imati blagu, mekanu sjenku (--sjena-kartice), ostale su ravne.
- Talasasti prelazi (SVG) između tamnih i svijetlih dijelova stranice, kao na odobrenom mockupu.
- Pokret (motion): samo CSS i SVG animacije, bez biblioteka; sve animacije su na kraju global.css.
  Sadržaj nikad ne smije ostati sakriven ako se animacija ne pokrene, a uz prefers-reduced-motion
  sve animacije se gase.
- Ikone: vlastite jednostavne inline SVG ikone (bez biblioteke ikona).
- Logo: riječ "ECHO" uz simbol zvučnog talasa, ispod "ILIDŽA". Nikad grb ni znak Općine.
- Nikad linkovi na društvene mreže ni dugme "Prijava/login" (demo uloge nisu prijava korisnika).
- Mobitel prvo (donja navigacija na mobitelu), zatim tablet i računar.
- Pristupačnost: kontrast najmanje WCAG AA, dugmad najmanje 44 px, rad tastaturom, alt tekst za slike.

## Model podataka (jedna prijava)
id, opcina ("ilidza"), naslov, opis, kategorija, predlozenaKategorija,
predlozeniPrioritet, potvrdjeniPrioritet (null dok admin ne potvrdi),
lat, lng, fotografijaId (ključ u IndexedDB ili null), fotografijaSkrivena (bool),
datumPrijave (ISO), status, historijaStatusa [{status, datum, napomena?}],
razlogOdbijanja, internaNapomena, glavnaPrijavaId (null ili id), brojPrijavitelja,
autorId, testniPodatak (uvijek true),
naselje (naziv naselja; za nove prijave najbliže približno središte naselja – aproksimacija; dodano u etapi 0 radi statistike po naselju).

## Statusi
NA_CEKANJU ("Na čekanju provjere", nije javno) → ODBIJENO (nije javno, uz razlog koji autor vidi)
NA_CEKANJU → ZAPRIMLJENO (javno) → U_OBRADI → PROSLIJEDJENO ("Proslijeđeno službi (simulacija)") → RIJESENO
Status mijenja samo administrator. Svaka promjena se upisuje u historijaStatusa.

## Kategorije (boja oznake na mapi + ključne riječi za prijedlog; liste se mogu proširiti)
- Ceste i trotoari: rupa, udarna rupa, asfalt, trotoar, pločnik, oštećena cesta
- Javna rasvjeta: rasvjeta, lampa, sijalica, mrak, ne svijetli, stub
- Otpad i deponije: smeće, otpad, deponija, kontejner, kanta, đubre
- Igrališta i parkovi: igralište, ljuljačka, tobogan, klupa, park
- Javni prevoz: autobus, tramvaj, stanica, kasni, linija, nadstrešnica
- Pješački prelazi i sigurnost: prelaz, zebra, semafor, brzina, opasno za pješake
- Javna infrastruktura: šaht, poklopac, ograda, most, kanalizacija, voda
- Zelene površine i okoliš: drvo, trava, zelena površina, sječa, zagađenje
Svaka kategorija ima svoju boju; boje moraju biti međusobno jasno različite i čitljive.

## Pravila prijedloga (src/logic/)
- Kategorija: normalizuj tekst (mala slova; uporedi i sa i bez dijakritika), prebroji pogotke
  ključnih riječi u naslovu i opisu, predloži kategoriju s najviše pogodaka; bez pogodaka nema prijedloga.
- Prioritet (bodovi): riječi opasnosti ("opasno", "povrijed", "otvoren šaht", "pao", "ozlijed") +3;
  spominjanje škole, vrtića ili igrališta +2; svaka povezana prijava +1.
  0–2 nizak, 3–4 srednji, 5+ visok. Funkcija vraća i RAZLOGE (listu pravila koja su se aktivirala),
  koji se prikazuju administratoru. U UI uz prioritet piše: "Orijentacioni prijedlog, nije procjena stvarne opasnosti."
- Mogući duplikat: ista kategorija, status nije ODBIJENO ni RIJESENO, udaljenost < PRAG_DUPLIKATA_M
  (konstanta, početno 50 m; haversine, R = 6371 km). Sistem duplikat samo PREDLAŽE; nikad ne povezuje automatski.

## Granice Ilidže (približno, za upozorenje i testne podatke)
Centar mape oko 43.83, 18.31. Približni okvir: lat 43.76–43.88, lng 18.20–18.40.
Lokacija izvan okvira dobija upozorenje, ali se ne blokira.
Koordinate su aproksimacija; ne predstavljaj ih kao zvanične granice općine.

## Ograničenja koja moraju biti dokumentovana (README i ekran O projektu)
- Podaci postoje samo u pregledniku i na uređaju na kojem su uneseni. Nema zajedničke baze:
  prijava napravljena na jednom računaru ne vidi se na drugom.
- GPS radi samo u sigurnom kontekstu: HTTPS (npr. GitHub Pages) ili localhost, uz dozvolu korisnika.
  Razvojna verzija otvorena na mobitelu preko adrese računara u mreži (http://192.168…) NEĆE imati GPS;
  to nije greška aplikacije. Ručni odabir lokacije na mapi mora uvijek raditi.

## Način rada
- Radi u etapama koje dobiješ u poruci. Ne gradi funkcionalnosti iz kasnijih etapa unaprijed.
- Na kraju svake etape pokreni testove i build, napravi git commit, pa napiši IZVJEŠTAJ:
  1. fajlovi koji su kreirani ili izmijenjeni;
  2. šta stvarno radi (provjereno);
  3. šta još nije implementirano;
  4. koji testovi su pokrenuti i s kakvim rezultatom;
  5. poznate greške i ograničenja;
  6. koraci za ručnu provjeru u pregledniku.
  Zatim STANI i čekaj potvrdu.
- Kad nisi siguran, pitaj umjesto da pretpostaviš.
- Ne briši i ne prepisuj ranije etape bez razloga; ako moraš, objasni zašto.