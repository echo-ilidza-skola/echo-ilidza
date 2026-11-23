// Trenutni jezik interfejsa (bosanski ili engleski) za cijelu aplikaciju.
// Izbor se pamti u pregledniku (preko storage.js), a <html lang> se postavlja na izabrani jezik.

import { createContext, useContext, useEffect, useState } from 'react'
import { ucitajJezik, sacuvajJezik } from '../data/storage.js'
import { prevedi } from './prevodi.js'

const JezikContext = createContext(null)

export function JezikProvider({ children }) {
  const [jezik, postaviJezik] = useState(() => ucitajJezik())

  useEffect(() => {
    document.documentElement.lang = jezik
  }, [jezik])

  function promijeniJezik(novi) {
    sacuvajJezik(novi)
    postaviJezik(novi)
  }

  // t('kljuc', { parametri }) – prevod u trenutnom jeziku.
  const t = (kljuc, parametri) => prevedi(jezik, kljuc, parametri)

  return <JezikContext.Provider value={{ jezik, promijeniJezik, t }}>{children}</JezikContext.Provider>
}

export function useJezik() {
  return useContext(JezikContext)
}
