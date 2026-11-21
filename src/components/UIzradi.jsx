// Iskrena oznaka za ekran koji još nije napravljen (pravilo br. 11:
// nedovršena funkcija se nikad ne prikazuje kao završena).

export default function UIzradi({ etapa, children }) {
  return (
    <div className="u-izradi" role="status">
      <strong>U izradi.</strong> Ovaj ekran još nije napravljen; planiran je za etapu {etapa}.
      {children && <div className="u-izradi-dodatak">{children}</div>}
    </div>
  )
}
