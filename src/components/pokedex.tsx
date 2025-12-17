import { useState } from "react";
import type { Carte } from "../types/carte";

interface PokedexProps {
  cartesCaptures: Carte[];
}

export default function Pokedex({ cartesCaptures }: PokedexProps) {
  const [selected, setSelected] = useState<Carte | null>(null);

  return (
    <div className="pokedex">
      {!selected && (
        <>
          <h1>Pokedex</h1>
          <ul className="pokedexcarte">
            {cartesCaptures.map((c) => (
              <li key={c.id} onClick={() => setSelected(c)}>
                <img src={c.image} alt={c.name} />
              </li>
            ))}
          </ul>
        </>
      )}

      {selected && (
        <div className="pokedex-detail">
          <img src={selected.image} alt={selected.name} />

          <div className="pokedex-info">
            <h2>{selected.name}</h2>
            <p><strong>ID :</strong> {selected.id}</p>
            <button onClick={() => setSelected(null)}>Retour</button>
          </div>
        </div>
      )}
    </div>
  );
}
