// Fotografije za TESTNE prijave. Ovo su slobodne fotografije s Wikimedia Commonsa (nisu snimljene
// u Ilidži) – služe samo da demonstracija izgleda stvarnije. Autori i licence su navedeni ovdje,
// u src/assets/IZVORI.md i na ekranu O projektu. Fotografije su smanjene na 800 px, bez EXIF podataka,
// a gdje je trebalo, izrezane tako da se ne vide auta ni registarske oznake (tablica autobusa t11 je pikselizirana).
// Zamijenit će ih fotografije koje snime učenici (bez lica i registarskih oznaka).

import t02 from '../assets/testne-fotografije/t02.jpg'
import t03 from '../assets/testne-fotografije/t03.jpg'
import t04 from '../assets/testne-fotografije/t04.jpg'
import t08 from '../assets/testne-fotografije/t08.jpg'
import t11 from '../assets/testne-fotografije/t11.jpg'
import t12 from '../assets/testne-fotografije/t12.jpg'
import t15 from '../assets/testne-fotografije/t15.jpg'

// Ključ fotografije testne prijave počinje s "test:", da storage.js zna da je u projektu, a ne u IndexedDB.
export const PREFIKS_TESTNE_FOTOGRAFIJE = 'test:'

export const TESTNE_FOTOGRAFIJE = {
  t02: {
    url: t02,
    autor: 'ŠJů',
    licenca: 'CC BY-SA 3.0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Fibichova,_kontejnery_na_t%C5%99%C3%ADd%C4%9Bn%C3%BD_odpad,_bordel_kolem.jpg',
  },
  t03: {
    url: t03,
    autor: 'Coastal Elite from Halifax, Canada',
    licenca: 'CC BY-SA 2.0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Damaged_Bus_Stop_Shelter_-_Montreal_(26111781270).jpg',
  },
  t04: {
    url: t04,
    autor: 'Santeri Viinamäki',
    licenca: 'CC BY-SA 4.0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Potholes_on_asphalt_road_20171023.jpg',
  },
  t08: {
    url: t08,
    autor: 'Alan Stanton',
    licenca: 'CC BY-SA 2.0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Ferndale_Road_N15_-_Dumped_Rubbish_(16246615431).jpg',
  },
  t11: {
    url: t11,
    autor: 'Pjotr Mahhonin',
    licenca: 'CC BY-SA 4.0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Iveco_Bus_at_Bus_Stop_City_Bus_Station_Odos_7th_Martiou_Rhodes_4_September_2018.jpg',
  },
  t12: {
    url: t12,
    autor: 'Aethonatic',
    licenca: 'CC0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Open_manhole_-_24_September_2026.jpg',
  },
  t15: {
    url: t15,
    autor: 'Santeri Viinamäki',
    licenca: 'CC BY-SA 4.0',
    izvor: 'https://commons.wikimedia.org/wiki/File:Damaged_dangerous_street_light_pole_20180524.jpg',
  },
}

// Ključ fotografije za testnu prijavu (ili null ako prijava nema fotografiju).
export function kljucTestneFotografije(idPrijave) {
  return TESTNE_FOTOGRAFIJE[idPrijave] ? PREFIKS_TESTNE_FOTOGRAFIJE + idPrijave : null
}
