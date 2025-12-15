import { useEffect, useState } from "react";
import { fetchPokemons } from "./Hook/useFetch";
import useCapture from "./Logique/Capture";
import type PokemonType from "./types/pokemonType";

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);
  const [equipes, setEquipes] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("Equipe") || "[]")
  );

  const loadPokemons = async () => {
    const data = await fetchPokemons();
    setPokemons(data);
  };

  const { count, capture, message } = useCapture(loadPokemons, setEquipes);

  useEffect(() => {
    const fetchData = async () => {
      await loadPokemons();
    };
    fetchData();
  }, []);

  return (
    <div className="game">
      {pokemons.map((p) => (
        <div key={p.id}>
          {/* Infos du Pokémon */}
          <div className="info">
            <p>{p.nameFr}</p>
            <p>{Array.isArray(p.type) ? p.type.join(" / ") : p.type}</p>
          </div>

          {/* Image et musique du Pokémon */}
          <div className="pokemon">
            <img src={p.image} alt={p.nameFr} />
            <audio autoPlay src={p.song} />
          </div>

          {/* Équipe */}
          <ul className="equipes">
            {equipes.map((e, index) => (
              <li
                key={index}
                onClick={() => {
                  const newEquipe = equipes.filter((poke) => poke !== e);
                  localStorage.setItem("Equipe", JSON.stringify(newEquipe));
                  setEquipes(newEquipe);
                }}
              >
                {e}
              </li>
            ))}
          </ul>

          {/* Dresseur et actions */}
          <div className="dresseur">
            <img src={p.trainer} alt="" />
            <button
              disabled={equipes.length >= 6}
              onClick={() => capture(p.taucap, p.nameFr)}
            >
              Lancer une Pokéball
            </button>
            <button onClick={loadPokemons}>Fuir</button>

            <p>
              {equipes.length >= 6
                ? "L'équipe est pleine. Supprimez un Pokémon avant de capturer."
                : message}
            </p>
            <p>{count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
