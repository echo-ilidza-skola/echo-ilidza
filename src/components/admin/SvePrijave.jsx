// Lista svih prijava s filterima. Klik na "Otvori" prikazuje sve alate za tu prijavu.

import { useState } from 'react'
import AdminPrijava from './AdminPrijava.jsx'
import StatusOznaka from '../StatusOznaka.jsx'
import KategorijaOznaka from '../KategorijaOznaka.jsx'
import { KATEGORIJE, NASELJA, STATUSI, PRIORITETI } from '../../data/konstante.js'
import { filtrirajZaAdmina } from '../../logic/administracija.js'
import { posljednjePrijave } from '../../logic/statistika.js'
import { formatirajDatum } from '../../logic/datum.js'
import { useJezik } from '../../jezik/JezikContext.jsx'

const PRAZNI_FILTERI = { status: '', kategorija: '', naselje: '', tekst: '' }

export default function SvePrijave({ sve }) {
  const [filteri, postaviFiltere] = useState(PRAZNI_FILTERI)
  const { jezik, t } = useJezik()
  const [otvorena, postaviOtvorenu] = useState(null)

  const prikazane = posljednjePrijave(filtrirajZaAdmina(sve, filteri), Infinity)
  const promijeni = (polje) => (e) => postaviFiltere({ ...filteri, [polje]: e.target.value })

  return (
    <div>
      <div className="admin-filteri" role="search" aria-label={t('sve.filteri')}>
        <div className="polje">
          <label htmlFor="f-tekst">{t('sve.pretraga')}</label>
          <input id="f-tekst" type="text" value={filteri.tekst} onChange={promijeni('tekst')} placeholder={t('sve.pretragaPrimjer')} />
        </div>
        <div className="polje">
          <label htmlFor="f-status">{t('sve.status')}</label>
          <select id="f-status" value={filteri.status} onChange={promijeni('status')}>
            <option value="">{t('sve.sviStatusi')}</option>
            {Object.keys(STATUSI).map((k) => (
              <option key={k} value={k}>
                {t(`statusi.${k}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="polje">
          <label htmlFor="f-kategorija">{t('sve.kategorija')}</label>
          <select id="f-kategorija" value={filteri.kategorija} onChange={promijeni('kategorija')}>
            <option value="">{t('sve.sveKategorije')}</option>
            {KATEGORIJE.map((k) => (
              <option key={k.kljuc} value={k.kljuc}>
                {t(`kategorije.${k.kljuc}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="polje">
          <label htmlFor="f-naselje">{t('sve.naselje')}</label>
          <select id="f-naselje" value={filteri.naselje} onChange={promijeni('naselje')}>
            <option value="">{t('sve.svaNaselja')}</option>
            {NASELJA.map((n) => (
              <option key={n.naziv} value={n.naziv}>
                {n.naziv}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="dugme dugme-sporedno dugme-malo" onClick={() => postaviFiltere(PRAZNI_FILTERI)}>
          {t('sve.ponisti')}
        </button>
      </div>

      <p className="prigusen" aria-live="polite">
        {t('sve.prikazano', { broj: prikazane.length, ukupno: sve.length })}
      </p>

      <ul className="admin-lista">
        {prikazane.map((p) => {
          const otvoreno = otvorena === p.id
          return (
            <li key={p.id} className={otvoreno ? 'admin-red admin-red--otvoren' : 'admin-red'}>
              <div className="admin-red-glava">
                <div className="admin-red-tekst">
                  <strong>{p.naslov}</strong>
                  <span className="admin-meta">
                    <KategorijaOznaka kategorija={p.kategorija} />
                    <span>{p.naselje}</span>
                    <span>{formatirajDatum(p.datumPrijave, false, jezik)}</span>
                    {p.brojPrijavitelja > 1 && <span>{t('sve.prijavitelja', { broj: p.brojPrijavitelja })}</span>}
                    {p.glavnaPrijavaId && <span>{t('sve.povezanaS', { id: p.glavnaPrijavaId })}</span>}
                    <span>
                      {t('sve.prioritet', {
                        prioritet: p.potvrdjeniPrioritet ? t(`prioriteti.${p.potvrdjeniPrioritet}`) : t('sve.nijePotvrdjen'),
                      })}
                    </span>
                  </span>
                </div>
                <StatusOznaka status={p.status} />
                <button
                  type="button"
                  className="dugme dugme-sporedno dugme-malo"
                  aria-expanded={otvoreno}
                  aria-controls={`admin-detalji-${p.id}`}
                  onClick={() => postaviOtvorenu(otvoreno ? null : p.id)}
                >
                  {otvoreno ? t('sve.zatvori') : t('sve.otvori')}
                </button>
              </div>
              {otvoreno && (
                <div id={`admin-detalji-${p.id}`}>
                  <AdminPrijava prijava={p} sve={sve} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
