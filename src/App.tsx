import { useEffect, useState } from "react";
import { fetchPokemons } from "./Hook/useFetch";
import type PokemonType from "./types/pokemonType";

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);

  const loadPokemons = async () => {
    const data = await fetchPokemons(1);
    setPokemons(data);
  };

  useEffect(() => {
    const run = async () => {
      await loadPokemons();
    };
    run();
  }, []);

  return (
    <div>
      {pokemons.map((p) => (
        <div key={p.id}>
          <p>{p.nameFr}</p>
          <img src={p.image} alt={p.nameFr} />
          <audio autoPlay src={p.song} />
        </div>
      ))}




      {/* <button onClick={loadPokemons}>Reload Pokémon</button> */}
    </div>
  );
}
