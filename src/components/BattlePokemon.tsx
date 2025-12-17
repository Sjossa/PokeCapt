import type PokemonType from "../types/pokemonType";
import EquipeList from "../components/EquipeList";
import { useEffect } from 'react';


type BattlePokemonProps = {
  pokemon: PokemonType;
  onCapture: () => void;
  onFlee: () => void;
  disabled: boolean;
  message: string;
  count: number;
  equipes: string[];
  favoris: string[];
  onRemove: (index: number) => void;
  onToggleFavori: (name: string) => void;
};

export default function BattlePokemon({
  pokemon,
  onCapture,
  onFlee,
  disabled,
  message,
  count,
  equipes,
  favoris,
  onRemove,
  onToggleFavori,

}: BattlePokemonProps) {
    useEffect(() => {
    if (message) {
      new Notification("Nouvelle alerte PWA !", {
        body: message,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        tag: "message-notification",
      });
    }
  }, [message]);

  return (
    <div className="battle">
      <div className="info">
        <p>{pokemon.nameFr}</p>
        <p>
          {Array.isArray(pokemon.type)
            ? pokemon.type.join(" / ")
            : pokemon.type}
        </p>
      </div>

      <div className="pokemon">
        <img src={pokemon.image} alt={pokemon.nameFr} />
        <audio autoPlay src={pokemon.song} />
      </div>

      <div className="dresseur">
        <button disabled={disabled} onClick={onCapture}>
          Lancer une Pokéball
        </button>
        <button onClick={onFlee}>Fuir</button>

        <p>{count}</p>
      </div>


      <EquipeList
        equipes={equipes}
        favoris={favoris}
        onRemove={onRemove}
        onToggleFavori={onToggleFavori}
      />

    </div>
  );
}
