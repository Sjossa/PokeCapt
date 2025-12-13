import type fetchPokemonType from "../types/fetchPokemonType";

export async function fetchPokemons(): Promise<fetchPokemonType[]> {
  try {
    const min = 1;
    const max = 151;
    const id = Math.floor(Math.random() * (max - min + 1)) + 1;

    // Fetch Pokémon et species
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    const pokemonJson = await pokemonRes.json();
    const speciesJson = await speciesRes.json();

    // Nom français
    const fr = speciesJson.names.find(
      (n: { name: string; language: { name: string } }) => n.language.name === "fr"
    )?.name;

    const taucap = speciesJson.capture_rate;

    // Types anglais
    const types = pokemonJson.types.map(
      (t: { type: { name: string } }) => t.type.name
    );

    // Types français via Promise.all
    const typesFr = await Promise.all(
      types.map(async (typeName) => {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const json = await res.json();
        return json.names.find(
          (n: { name: string; language: { name: string } }) => n.language.name === "fr"
        )?.name ?? typeName; // fallback si pas trouvé
      })
    );

    // Détermination du shiny
    const isShiny = Math.floor(Math.random() * 512) === 0;

    const image = isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const song = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

    console.log("Taux capture :", taucap);
    console.log("ID :", id);
    console.log("Types FR :", typesFr);

    // Retour
    return [
      {
        id,
        nameFr: fr ?? "Nom non trouvé",
        language: { name: "fr" },
        image,
        song,
        taucap,
        type: typesFr,
      },
    ];
  } catch (err) {
    console.error("❌ Erreur fetch :", err);
    return [];
  }
}
