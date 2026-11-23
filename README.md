# ECHO Ilidža

**Glas građana koji se čuje.**

ECHO je školski prototip web aplikacije u kojoj građani prijavljuju komunalne probleme (rupe na cesti,
rasvjeta, otpad, igrališta…), prate status prijave i vide prijave na mapi. Razvijaju ga učenici Četvrte
gimnazije Ilidža uz mentoricu. Pilot-područje je Općina Ilidža (Kanton Sarajevo).

Ime dolazi od eha: građanin pošalje prijavu (glas), a status prijave mu „odgovori“.

> ⚠ **Demo verzija – testni podaci, nisu stvarne prijave Općine Ilidža.**
> Aplikacija **ne komunicira s Općinom ni sa bilo kojom institucijom**. Status „Proslijeđeno službi
> (simulacija)“ je samo simulacija.

---

## Sadržaj

1. [Pokretanje](#pokretanje)
2. [Šta aplikacija radi](#šta-aplikacija-radi)
3. [Struktura projekta](#struktura-projekta)
4. [Ograničenja (važno!)](#ograničenja-važno)
5. [GPS i HTTPS](#gps-i-https)
6. [Objava na GitHub Pages](#objava-na-github-pages)
7. [Vraćanje na prethodnu verziju](#vraćanje-na-prethodnu-verziju)
8. [Testovi](#testovi)
9. [Izvori i licence](#izvori-i-licence)

---

## Pokretanje

### Najlakše: dvoklik
U folderu projekta dvokliknite **`Pokreni ECHO.bat`** (Windows). Pri prvom pokretanju instalira potrebne
pakete, a zatim otvori aplikaciju u pregledniku. Prozor ostavite otvorenim dok koristite aplikaciju.

### Preko komandne linije
Potreban je [Node.js](https://nodejs.org) (verzija LTS, 20 ili novija).

```powershell
npm install        # samo prvi put: instalira pakete
npm run dev        # razvojna verzija na http://localhost:5173
npm test           # pokreće testove logike (Vitest)
npm run build      # pravi gotovu verziju u folder dist/
npm run preview    # prikazuje gotovu verziju (npr. http://localhost:4173)
```

**Fajl `index.html` se ne može otvoriti dvoklikom** – aplikacija mora raditi preko servera (`npm run dev`
ili `npm run preview`), jer preglednici ne pokreću moderne JavaScript module s adrese `file:///…`.

---

## Šta aplikacija radi

**Ekrani**
- **Početna** – predstavljanje, statistika javnih prijava, „Kako funkcioniše“, mini-mapa i posljednje prijave.
- **Mapa** – odobrene prijave kao oznake (boja = kategorija, oblik = status), legenda, filteri,
  toplotna mapa i lista prijava (zamjena za mapu za čitače ekrana).
- **Detalji prijave** – samo javna polja, traka napretka i historija statusa.
- **Prijavi problem** – 3 koraka: (1) fotografija, naslov, opis, kategorija; (2) lokacija (GPS, klik na
  mapu ili naselje); (3) pregled i slanje. Prijedlog mogućih duplikata prije slanja.
- **Moje prijave** – sve prijave demo građanina, i one na čekanju i odbijene (s razlogom).
- **Administracija** – red čekanja (Odobri/Odbij), sve prijave s filterima, promjena statusa, interna
  napomena, sakrivanje fotografije, povezivanje prijava, statistika s grafikonima.
- **O projektu** – šta je ECHO, pravila naspram AI, demo uloge, gdje su podaci, kada radi GPS.

**Demo uloge (Gost / Građanin / Administrator)** u zaglavlju služe samo za demonstraciju.
**To nije prijava korisnika ni zaštita podataka** – svako može odabrati bilo koju ulogu.

**Pravila, a ne AI.** Prijedlog kategorije i prioriteta su jednostavna pravila (ključne riječi i bodovi),
napisana u `src/logic/`. Aplikacija ne koristi umjetnu inteligenciju, ne analizira fotografije i ne
šalje ništa vanjskim servisima. Konačnu kategoriju i prioritet potvrđuje administrator.

**Privatnost.** Nova prijava i fotografija postaju javne tek nakon odobrenja administratora. Autor,
interna napomena i predloženi prioritet nikad se ne prikazuju javno. Fotografije se prije spremanja
smanje na najviše 1024 px (JPEG 0,7), čime se brišu i EXIF podaci (npr. GPS koordinate telefona).

---

## Struktura projekta

```
ECHO_Ilidža/
├─ index.html              ulaz za Vite (lang="bs")
├─ Pokreni ECHO.bat        pokretanje dvoklikom (Windows)
├─ CLAUDE.md               pravila projekta (za razvoj uz Claude Code)
├─ .github/workflows/      automatska objava na GitHub Pages
└─ src/
   ├─ main.jsx, App.jsx    pokretanje i rute (HashRouter: adrese oblika …/#/mapa)
   ├─ data/
   │  ├─ storage.js        JEDINI pristup podacima (localStorage + IndexedDB za fotografije)
   │  ├─ testniPodaci.js   28 izmišljenih prijava
   │  ├─ konstante.js      kategorije, statusi, naselja, okvir Ilidže
   │  └─ tekstovi.js       tekstovi banera na početnoj
   ├─ logic/               čista logika s Vitest testovima (*.test.js):
   │                       udaljenost (haversine), prijedlog kategorije, prioritet,
   │                       duplikati, statistika, javni prikaz, administracija, …
   ├─ components/          dijelovi ekrana (mapa/, prijava/, admin/, pocetna/)
   ├─ pages/               ekrani (Pocetna, Mapa, DetaljiPrijave, PrijaviProblem, …)
   ├─ hooks/               usePodaci, useVidljivo, useBrojanje, useManjePokreta
   ├─ utils/slike.js       smanjivanje fotografije kroz canvas
   ├─ styles/              global.css, obrazac.css, admin.css (CSS varijable, bez UI biblioteka)
   └─ assets/              slika banera + IZVORI.md
```

**Pravilo za razvoj:** komponente nikad ne diraju `localStorage` direktno – sve ide kroz
`src/data/storage.js`. U kasnijoj fazi taj fajl se može zamijeniti pozivima na server.

---

## Ograničenja (važno!)

- **Podaci postoje samo u pregledniku i na uređaju na kojem su uneseni.** Nema zajedničke baze:
  prijava napravljena na jednom računaru **ne vidi se** na drugom računaru ni telefonu.
- Brisanjem podataka preglednika nestaju nove prijave i fotografije; aplikacija se ne ruši, nego ponovo
  učita 28 testnih prijava. Administrator to može uraditi i dugmetom „Vrati testne podatke“.
- Demo uloge nisu zaštita podataka.
- Prijedlozi su pravila i ponekad pogriješe (npr. riječ „kasno“ podsjeća na „kasni“ → javni prevoz).
- Mogući duplikat: ista kategorija, manje od 50 m. Duplikati se građaninu nude samo među javnim
  prijavama, a sistem nikad ne povezuje prijave sam.
- Granice Ilidže i središta naselja su **približni** – to nisu zvanične granice općine. Lokacija izvan
  okvira dobija upozorenje, ali se ne blokira.
- Pločice mape dolaze s OpenStreetMap servera; bez interneta mapa nema pozadine (oznake i lista rade).
- Fotografije u HEIC formatu (neki iPhone uređaji) preglednik na računaru možda ne može otvoriti.

---

## GPS i HTTPS

- GPS („Koristi moju lokaciju“) radi **samo u sigurnom kontekstu**: na adresi `https://` (npr. GitHub
  Pages) ili na `localhost`, i samo ako korisnik dozvoli pristup lokaciji.
- Razvojna verzija otvorena na mobitelu preko adrese računara u mreži (npr. `http://192.168.1.20:5173`)
  **neće imati GPS**. To nije greška aplikacije, nego pravilo preglednika – aplikacija to i objasni porukom.
- **Ručni odabir lokacije uvijek radi**: klik na mapu ili izbor naselja.
- Za probu na telefonu najbolje je objaviti aplikaciju na GitHub Pages (HTTPS).

---

## Objava na GitHub Pages

Aplikacija je pripremljena za GitHub Pages: koristi `HashRouter` (adrese `…/#/mapa`) i `base: './'` u
`vite.config.js`, pa radi u bilo kojem podfolderu bez dodatnih podešavanja.

### Automatski (preporučeno)
1. Napravite novi repozitorij na GitHubu (npr. `echo-ilidza`).
2. Povežite projekt i pošaljite kod:
   ```powershell
   git remote add origin https://github.com/<korisnik>/echo-ilidza.git
   git push -u origin main
   ```
3. Na GitHubu otvorite **Settings → Pages** i pod **Source** odaberite **GitHub Actions**.
4. Radni tok `.github/workflows/objava.yml` pri svakom slanju na granu `main` pokrene testove, napravi
   build i objavi aplikaciju na `https://<korisnik>.github.io/echo-ilidza/`.

### Ručno (bez GitHub Actions)
1. `npm run build`
2. Sadržaj foldera `dist/` objavite na granu `gh-pages` ili ga učitajte na bilo koji statički hosting
   koji podržava HTTPS.

**Napomena prije objave:** repozitorij će biti javan ako ga tako napravite. U njemu nema ličnih podataka
(svi podaci su testni), ali provjerite da u `src/assets/` nema fotografija koje ne smiju biti javne.

---

## Vraćanje na prethodnu verziju

Verzija koja je bila objavljena prije dorada sačuvana je pod oznakom (tagom) **`v1.0-prije-dorada`**,
lokalno i na GitHubu. Dorade se rade na posebnoj grani **`dorade`**.

**Kako se objavljuje:** stranicu objavljuje GitHub Actions (`.github/workflows/objava.yml`), i to
**samo** kad se kod pošalje na granu `main` (ili kad se radni tok ručno pokrene na GitHubu).
Rad na grani `dorade`, pa čak i njeno slanje na GitHub, NE mijenja objavljenu stranicu.
Ne koristi se grana `gh-pages`.

### 1. Pregled izmjena lokalno (prije objave)
Na grani `dorade`:
```powershell
git switch dorade
npm run dev
```
Aplikacija se otvori na `http://localhost:5173/`.

Za pregled na mobitelu u istoj Wi-Fi mreži:
```powershell
npm run dev -- --host
```
Na mobitelu otvorite adresu koju ispiše Vite (npr. `http://192.168.1.20:5173/`).
**GPS tada ne radi**, jer preglednik dozvoljava lokaciju samo na HTTPS-u ili na `localhost`-u
(vidi [GPS i HTTPS](#gps-i-https)). To nije greška aplikacije; lokacija se može odabrati ručno na mapi.

### 2. Odustajanje od izmjena prije objave
Ako se dorade ne svide, a još nisu objavljene, vratite se na glavnu granu i obrišite granu dorade:
```powershell
git switch main
git branch -D dorade
```
Ako je grana `dorade` bila poslana na GitHub, obrišite je i tamo:
```powershell
git push origin --delete dorade
```
Objavljena stranica se pritom ne mijenja.

### 3. Vraćanje objavljene stranice na `v1.0-prije-dorada`
Ako su dorade objavljene (spojene u `main`), a ne svide se, glavna grana se vraća na stari sadržaj
novim commitom (historija se ne briše, pa se dorade kasnije mogu ponovo vratiti):
```powershell
git switch main
git pull
git restore --source=v1.0-prije-dorada --staged --worktree -- .
git commit -m "Vraćena verzija v1.0-prije-dorada"
git push origin main
```
Slanje na `main` automatski pokreće objavu; za par minuta stranica izgleda kao verzija `v1.0-prije-dorada`.
Napredak se vidi na GitHubu, na kartici **Actions**.

Starija verzija se uvijek može i samo pogledati lokalno, bez ikakve promjene objave:
```powershell
git switch --detach v1.0-prije-dorada
npm run dev
git switch main
```

---

## Testovi

```powershell
npm test
```

Testovi provjeravaju čistu logiku u `src/logic/` i `src/data/`: haversine (uključujući udaljenost od
tačno 50 m), prijedlog kategorije (prazan tekst, dijakritici, „grupa“ ≠ „rupa“), prioritet s razlozima,
duplikate, statistiku, javni prikaz (bez autora, interne napomene i predloženog prioriteta),
administraciju (statusi, povezivanje), validaciju obrasca i testne podatke.

Završna ručna provjera (etapa 8) prošla je cijelu kontrolnu listu iz plana projekta na širini mobitela
i računara.

---

## Izvori i licence

- Mapa: © [saradnici OpenStreetMap-a](https://www.openstreetmap.org/copyright), prikaz biblioteke
  [Leaflet](https://leafletjs.com) (BSD-2); toplotna mapa: Leaflet.heat (BSD-2).
- Font naslova: Montserrat (SIL Open Font License), paket `@fontsource/montserrat`.
- Slika na početnoj stranici je **ilustracija generisana pomoću AI**, a ne stvarna fotografija Ilidže
  (vidi `src/assets/IZVORI.md`). Zamijenit će je fotografija koju snime učenici.
- Ikone i znak eha nacrtani su posebno za ovaj projekat.
- Tehnologije: React, Vite, react-router-dom, react-leaflet, idb-keyval, Vitest.
