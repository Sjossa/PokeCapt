import { useEffect, useState } from "react";
import { fetchPokemons } from "./Hook/useFetch";
import useCapture from "./Logique/Capture";
import type PokemonType from "./types/pokemonType";


interface Carte {
  name: string;
  image: string;
  id: number;
}

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);
  const [equipes, setEquipes] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("Equipe") || "[]")
  );
  const [favoris, setFavoris] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("Favoris") || "[]")
  );
  const [cartesCaptures, setCartesCaptures] = useState<Carte[]>(() =>
    JSON.parse(localStorage.getItem("Cartes") || "[]")
  );

  const { count, capture, message } = useCapture(loadPokemons, setEquipes);

  const captureWithCarte = (taux: number, name: string, carte: Carte) => {
    capture(taux, name);

    if (!cartesCaptures.some((c) => c.id === carte.id)) {
      const newCartes = [...cartesCaptures, carte];
      setCartesCaptures(newCartes);
      localStorage.setItem("Cartes", JSON.stringify(newCartes));
    }
  };

  const toggleFavori = (name: string) => {
    const newFavoris = favoris.includes(name)
      ? favoris.filter((f) => f !== name)
      : [...favoris, name];

    setFavoris(newFavoris);
    localStorage.setItem("Favoris", JSON.stringify(newFavoris));
  };

  const removeFromEquipe = (index: number) => {
    const name = equipes[index];
    if (favoris.includes(name)) return;

    const newEquipe = equipes.filter((_, i) => i !== index);
    setEquipes(newEquipe);
    localStorage.setItem("Equipe", JSON.stringify(newEquipe));
  };

  async function loadPokemons() {
    const data = await fetchPokemons();
    setPokemons(data);
  }

  useEffect(() => {
    loadPokemons();
  }, []);

  return (
    <div className="game">
      {pokemons.map((p) => (
        <div className="battle" key={p.id}>
          <div className="info">
            <p>{p.nameFr}</p>
            <p>{Array.isArray(p.type) ? p.type.join(" / ") : p.type}</p>
          </div>

          <div className="pokemon">
            <img src={p.image} alt={p.nameFr} />
            <audio autoPlay src={p.song} />
          </div>

          <ul className="equipes">
            {equipes.map((e, index) => {
              const isFavori = favoris.includes(e);
              return (
                <li
                  key={index}
                  onClick={() => removeFromEquipe(index)}
                  title={
                    isFavori
                      ? "Pokémon favori (protégé)"
                      : "Cliquer pour retirer de l'équipe"
                  }
                  style={{
                    opacity: isFavori ? 1 : 0.9,
                    cursor: isFavori ? "not-allowed" : "pointer",
                  }}
                >
                  {e}
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      toggleFavori(e);
                    }}
                    title="Mettre en favori"
                    style={{
                      marginLeft: "8px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: isFavori ? "gold" : "#999",
                    }}
                  >
                    ★
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="dresseur">
            <button
              disabled={equipes.length >= 6}
              onClick={() => captureWithCarte(p.taucap, p.nameFr, p.cartes[0])}
            >
              Lancer une Pokéball
            </button>
            <button onClick={loadPokemons}>Fuir</button>
            <p>{equipes.length >= 6 ? "L'équipe est pleine." : message}</p>
            <p>{count}</p>
          </div>

          <div className="pokedex">
            <h1>Pokedex</h1>
            <ul className="pokedexcarte">
              {cartesCaptures.map((c) => (
                <li key={c.id}>
                  <img src={c.image} alt={c.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
