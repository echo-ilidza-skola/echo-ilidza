// Trenutna DEMO uloga (Gost / Građanin / Administrator).
// Ovo je samo demonstracija – NIJE prijava korisnika ni zaštita podataka.

import { createContext, useContext, useState } from 'react'
import { ucitajUlogu, sacuvajUlogu } from '../data/storage.js'

const UlogaContext = createContext(null)

export function UlogaProvider({ children }) {
  const [uloga, postaviUlogu] = useState(() => ucitajUlogu())

  function promijeniUlogu(novaUloga) {
    sacuvajUlogu(novaUloga)
    postaviUlogu(novaUloga)
  }

  return (
    <UlogaContext.Provider value={{ uloga, promijeniUlogu }}>
      {children}
    </UlogaContext.Provider>
  )
}

export function useUloga() {
  return useContext(UlogaContext)
}
