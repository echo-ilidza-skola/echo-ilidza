// Tekstovi istaknutog (hero) dijela početne stranice, na jednom mjestu da ih je lako promijeniti.
// Naslov se prikazuje velikim slovima preko CSS-a; drugi red je istaknut limetom.

// Podnaslov aplikacije (objašnjenje imena: eho je glas koji se čuje i na koji stiže odgovor).
// Prikazuje se iznad naslova na početnoj stranici i u podnožju.
export const PODNASLOV = 'Glas građana koji se čuje'

export const HERO = {
  // Mali red iznad naslova.
  iznadNaslova: 'ECHO Ilidža · ' + PODNASLOV,
  naslovPrviRed: 'Vidiš problem?',
  naslovDrugiRed: 'Pokreni promjenu.',
  // Rečenica ispod naslova.
  opis: 'Prijavi komunalni problem u svom naselju. Označi lokaciju i prati šta se dešava s prijavom.',
  // Kratka poruka ispod dugmeta (uz znak eha).
  poruka: 'Prijavi problem. Pošalji signal. Prati šta se dešava.',
  dugme: 'Pošalji prijavu',
  napomena: 'Školski prototip · testni podaci',
}
