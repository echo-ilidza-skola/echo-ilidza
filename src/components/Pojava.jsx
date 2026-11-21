// Omotač koji svoj sadržaj lagano "podigne" i prikaže kad dođe na ekran.
// "kasnjenje" (u sekundama) služi da se više elemenata pojavi jedan za drugim.

import { useVidljivo } from '../hooks/useVidljivo.js'

export default function Pojava({ kasnjenje = 0, className = '', children }) {
  const [ref, vidljivo] = useVidljivo()
  return (
    <div
      ref={ref}
      className={`pojava ${vidljivo ? 'pojava-vidljivo' : ''} ${className}`}
      style={{ transitionDelay: `${kasnjenje}s` }}
    >
      {children}
    </div>
  )
}
