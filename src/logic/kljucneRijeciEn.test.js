import { describe, it, expect } from 'vitest'
import { KATEGORIJE } from '../data/konstante.js'
import { RIJECI_OPASNOSTI, RIJECI_DJECA } from './prioritet.js'
import { pronadjiKljucneRijeci } from './tekst.js'

// Uobičajene bosanske riječi i rečenice: engleske ključne riječi ih NE smiju pogrešno pronaći
// (npr. "pole" bi se skratilo na "pol" i pronašlo "polomljena").
const BOSANSKI_TEKST =
  'Ljuljacka polomljena, treba popraviti. Trenutno je opasno, djeca se igraju. Pored puta je busen trave, ' +
  'fenjer ne radi, voda curi, stanica je daleko, deponija smeca, dugo vremena niko nije dolazio. ' +
  'Kanta je puna, sijalica pregorjela, tobogan zahrdao, klupa slomljena, semafor ne radi, ograda pala, busotina.'

// Engleske riječi su one koje nisu i u bosanskom (npr. "park" i "zebra" su u oba jezika).
const ENGLESKE = [
  'pothole', 'asphalt', 'sidewalk', 'pavement', 'damaged road', 'street light', 'streetlight', 'lamppost', 'bulb', 'dark',
  'trash', 'garbage', 'waste', 'litter', 'rubbish', 'dumpster', 'playground', 'swing', 'slide', 'bench',
  'buses', 'bus stop', 'bus line', 'shelter', 'timetable', 'delay', 'crosswalk', 'pedestrian crossing', 'traffic light', 'speeding',
  'manhole', 'cover', 'fence', 'bridge', 'sewer', 'water', 'trees', 'fallen tree', 'branch', 'grass', 'green area',
  'logging', 'pollution', 'danger', 'injur', 'open manhole', 'fell', 'hurt', 'school', 'kindergarten',
]

describe('engleske ključne riječi ne pronalaze bosanske riječi', () => {
  it('sve engleske riječi su zaista u listama', () => {
    const sve = [...KATEGORIJE.flatMap((k) => k.kljucneRijeci), ...RIJECI_OPASNOSTI, ...RIJECI_DJECA]
    for (const r of ENGLESKE) expect(sve, r).toContain(r)
  })

  it('nijedna engleska riječ ne pronalazi ništa u bosanskom tekstu', () => {
    expect(pronadjiKljucneRijeci(BOSANSKI_TEKST, ENGLESKE)).toEqual([])
  })
})
