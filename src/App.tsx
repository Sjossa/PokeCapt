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

  const { count, capture, message, setMessage } = useCapture(
    loadPokemons,
    setEquipes
  );

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

          <button
            onClick={() => {
              capture(p.taucap, p.nameFr);
            }}
          >
            lancer une pokebal
          </button>
        </div>
      ))}
      <p className="choix">{message}</p>

      <ul className="aaa">
        {equipes.map((e: string, index: number) => (
          <li
            key={index}
            onClick={() => {
              if (message) {
                const savedEquipe = localStorage.getItem("Equipe");
                if (!savedEquipe) return;
                let equipe = JSON.parse(savedEquipe) as string[];
                equipe = equipe.filter((p) => p !== e);
                localStorage.setItem("Equipe", JSON.stringify(equipe));

                console.log(`${e} supprimé`);
                setEquipes(equipe);
                setMessage("");
              }
            }}
          >
            {e}
          </li>
        ))}
      </ul>

      <p>Compteur : {count}</p>
    </div>
  );
}
