import type PokemonType from "../types/pokemonType";
import type { Carte } from "../types/carte";

const CACHE_KEY = "pokemon-last-cache";

export async function fetchPokemons(): Promise<PokemonType[]> {
      if (!navigator.onLine) {
  const cached = localStorage.getItem("pokemon-last-cache");
  return cached ? JSON.parse(cached) : [];
}
  try {



    const min = 1;
    const max = 151;
    const id = Math.floor(Math.random() * (max - min + 1)) + 1;

    /* =========================
       FETCH POKÉMON PRINCIPAL
       ========================= */
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
    ]);

    if (!pokemonRes.ok || !speciesRes.ok) {
      throw new Error("API Pokémon indisponible");
    }

    const pokemonJson = await pokemonRes.json();
    const speciesJson = await speciesRes.json();

    /* =========================
       NOM FR + TAUX DE CAPTURE
       ========================= */
    const nameFr =
      speciesJson.names.find(
        (n: { language: { name: string } }) => n.language.name === "fr"
      )?.name ?? "Nom inconnu";

    const taucap = speciesJson.capture_rate;

    /* =========================
       TYPES EN FR
       ========================= */
    const types = pokemonJson.types.map(
      (t: { type: { name: string } }) => t.type.name
    );

    const typesFr = await Promise.all(
      types.map(async (typeName: string) => {
        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/type/${typeName}`
          );
          const json = await res.json();
          return (
            json.names.find(
              (n: { language: { name: string } }) =>
                n.language.name === "fr"
            )?.name ?? typeName
          );
        } catch {
          return typeName;
        }
      })
    );

    /* =========================
       CARTES TCG (BEST EFFORT)
       ========================= */
  let cartes: Carte[] = [];
let allCards: Carte[] = [];

    try {
      const sets = await Promise.all([
        fetch("https://api.tcgdex.net/v2/fr/sets/Set%20de%20Base/").then((r) =>
          r.json()
        ),
        fetch("https://api.tcgdex.net/v2/fr/sets/jungle/").then((r) =>
          r.json()
        ),
        fetch("https://api.tcgdex.net/v2/fr/sets/fossile/").then((r) =>
          r.json()
        ),
        fetch(
          "https://api.tcgdex.net/v2/fr/sets/Wizards%20Black%20Star%20Promos"
        ).then((r) => r.json()),
      ]);

      allCards = sets.flatMap((s) => s.cards);

      const carte = allCards.find(
        (card: { name: string }) => card.name === nameFr
      );

      if (carte) {
        cartes = [
          {
            id: carte.id,
            name: carte.name,
            image: carte.image
              ? `${carte.image}/low.webp`
              : "https://pokecardex.b-cdn.net/assets/images/sets/PRWC/HD/8.jpg",
          },
        ];
      }
    } catch {

    }


    const isShiny = Math.floor(Math.random() * 472) === 0;

    const image = isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const song = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

    const trainer =
      "https://play.pokemonshowdown.com/sprites/trainers/red-gen1main.png";

    const result: PokemonType[] = [
      {
        id,
        nameFr,
        language: { name: "fr" },
        image,
        song,
        taucap,
        type: typesFr,
        trainer,
        cartes,
        allCards,
      },
    ];

    /* =========================
       CACHE LOCAL (CLÉ DU OFFLINE)
       ========================= */
    localStorage.setItem(CACHE_KEY, JSON.stringify(result));

    return result;
  } catch (err) {
    console.warn("⚠️ Hors ligne → chargement du cache");

    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  }
}
