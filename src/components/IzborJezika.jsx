// Izbor jezika u zaglavlju: dva mala dugmeta "BS" i "EN" (bez zastava – zastava označava državu, ne jezik).
// Aktivni jezik je istaknut; čitač ekrana čuje puni naziv jezika i da li je odabran.

import { JEZICI, OZNAKE_JEZIKA } from '../jezik/prevodi.js'
import { useJezik } from '../jezik/JezikContext.jsx'

export default function IzborJezika() {
  const { jezik, promijeniJezik, t } = useJezik()
  return (
    <div className="izbor-jezika" role="group" aria-label={t('jezik.izbor')}>
      {JEZICI.map((j) => (
        <button
          key={j}
          type="button"
          lang={j}
          aria-pressed={j === jezik}
          aria-label={OZNAKE_JEZIKA[j].puno}
          title={OZNAKE_JEZIKA[j].puno}
          onClick={() => promijeniJezik(j)}
        >
          {OZNAKE_JEZIKA[j].kratko}
        </button>
      ))}
    </div>
  )
}
