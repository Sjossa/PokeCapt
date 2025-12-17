import { useEffect, useState } from "react";
import { fetchPokemons } from "./Hook/useFetch";
import useCapture from "./Logique/Capture";

import type { Carte } from "./types/carte";
import type PokemonType from "./types/pokemonType";

import { useLocalStorage } from "./Hook/useLocalStorage";
import BattlePokemon from "./components/BattlePokemon";
import Modal from "./components/modal";
import ThemeToggle from "./components/theme";

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);
  const [equipes, setEquipes] = useLocalStorage<string[]>("Equipe", []);
  const [favoris, setFavoris] = useLocalStorage<string[]>("Favoris", []);
  const [cartesCaptures, setCartesCaptures] = useLocalStorage<Carte[]>(
    "Cartes",
    []
  );

  const { count, capture, message, resetCount } = useCapture(
    loadPokemons,
    setEquipes
  );

  const [isCapturing, setIsCapturing] = useState(false);

  // Chargement des pokémons
  async function loadPokemons() {
    const data = await fetchPokemons();
    setPokemons(data);
  }

  useEffect(() => {
    loadPokemons();
    Notification.requestPermission();
  }, []);

  const captureWithCarte = (taux: number, name: string, carte?: Carte) => {
    capture(taux, name);

    if (!carte) return; 

    setCartesCaptures((prev) =>
      prev.some((c) => c.id === carte.id) ? prev : [...prev, carte]
    );
  };

  const toggleFavori = (name: string) => {
    setFavoris((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const removeFromEquipe = (index: number) => {
    const name = equipes[index];
    if (favoris.includes(name)) return;

    setEquipes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCapture = (p: PokemonType) => {
    if (isCapturing) return;
    setIsCapturing(true);

    const carte = p.cartes?.[0];
    captureWithCarte(p.taucap, p.nameFr, carte);

    setIsCapturing(false);
  };

  return (
    <div className="game">
      {pokemons.map((p) => (
        <div className="game-contenue" key={p.id}>
          <BattlePokemon
            pokemon={p}
            disabled={isCapturing}
            message={
              equipes.length >= 6 ? "L'équipe est pleine." : message ?? ""
            }
            count={count}
            onCapture={() => handleCapture(p)}
            onFlee={() => {
              loadPokemons();
              resetCount();
            }}
            equipes={equipes}
            favoris={favoris}
            onRemove={removeFromEquipe}
            onToggleFavori={toggleFavori}
          />
          <Modal cartesCaptures={cartesCaptures} />
          <ThemeToggle />
        </div>
      ))}
    </div>
  );
}
