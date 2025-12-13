import { useEffect, useState } from "react";
import { fetchPokemons } from "./Hook/useFetch";
import useCapture from "./Logique/Capture";
import type PokemonType from "./types/pokemonType";

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);

  const loadPokemons = async () => {
    const data = await fetchPokemons();
    setPokemons(data);
  };

  const { count, capture } = useCapture(loadPokemons);

  useEffect(() => {
    const fetchData = async () => {
      await loadPokemons();
    };

    fetchData();
  }, []);

  return (
    <div>
      {pokemons.map((p) => (
        <div key={p.id}>
          <p>{p.nameFr}</p>
          <p>{p.type}</p>
          <img src={p.image} alt={p.nameFr} />
          <audio autoPlay src={p.song} />

           <button onClick={() => capture(p.taucap)}>Reload Pokémon</button>

        </div>

      ))}



      <p>Compteur : {count}</p>
    </div>
  );
}
