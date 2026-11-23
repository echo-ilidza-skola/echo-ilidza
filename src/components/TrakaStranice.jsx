// Tanka tamna traka s naslovom stranice, ispod zaglavlja i u istom stilu kao zaglavlje.
// Koriste je sve unutrašnje stranice (Mapa, Prijavi, Moje, O projektu, Administracija, detalji),
// da se vidi da pripadaju istoj aplikaciji kao i Početna.
//   naslov  – tekst glavnog naslova stranice (h1)
//   nazad   – (nije obavezno) link za povratak, prikazan iznad naslova
//   children – (nije obavezno) dugme ili druga radnja desno od naslova

export default function TrakaStranice({ naslov, nazad, children }) {
  return (
    <div className="traka-stranice puna-sirina">
      <div className="traka-stranice-sadrzaj">
        <div className="traka-stranice-tekst">
          {nazad}
          <h1>{naslov}</h1>
        </div>
        {children && <div className="traka-stranice-radnje">{children}</div>}
      </div>
    </div>
  )
}
