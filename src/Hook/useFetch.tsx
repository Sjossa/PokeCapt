import type fetchPokemonType from "../types/fetchPokemonType";

export async function fetchPokemons(): Promise<fetchPokemonType[]> {
  try {
     const min = 1;
    const max = 151;
    const id = Math.floor(Math.random() * (max - min + 1)) + 1;

    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
    ]);

    const pokemonJson = await pokemonRes.json();
    const speciesJson = await speciesRes.json();

    const nameFr =
      speciesJson.names.find(
        (n: { language: { name: string } }) => n.language.name === "fr"
      )?.name ?? "Nom non trouvé";

    const taucap = speciesJson.capture_rate;

    const types = pokemonJson.types.map(
      (t: { type: { name: string } }) => t.type.name
    );

    const typesFr = await Promise.all(
      types.map(async (typeName: string) => {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const json = await res.json();
        return (
          json.names.find(
            (n: { language: { name: string } }) => n.language.name === "fr"
          )?.name ?? typeName
        );
      })
    );

    const sets = await Promise.all([
      fetch("https://api.tcgdex.net/v2/fr/sets/Set%20de%20Base/").then((res) =>
        res.json()
      ),
      fetch("https://api.tcgdex.net/v2/fr/sets/jungle/").then((res) =>
        res.json()
      ),
      fetch("https://api.tcgdex.net/v2/fr/sets/fossile/").then((res) =>
        res.json()
      ),
      fetch(
        "https://api.tcgdex.net/v2/fr/sets/Wizards%20Black%20Star%20Promos"
      ).then((res) => res.json()),
    ]);

    const allCards = [
      ...sets[0].cards,
      ...sets[1].cards,
      ...sets[2].cards,
      ...sets[3].cards,
    ];

    const carte = allCards.find(
      (card: { name: string }) => card.name === nameFr
    );

    const cartes = carte
      ? [
          {
            id : carte.id,
            name: carte.name,

           image:  carte.image ? `${carte.image}/low.webp` : "https://pokecardex.b-cdn.net/assets/images/sets/PRWC/HD/8.jpg?class=hd"


          },
        ]
      : [];

    const isShiny = Math.floor(Math.random() * 472) === 0;

    const image = isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const song = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

    const trainer =
      "https://play.pokemonshowdown.com/sprites/trainers/red-gen1main.png";

    return [
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
      },
    ];
  } catch (err) {
    console.error("❌ Erreur fetch :", err);
    return [];
  }
}
