import type fetchPokemonType from "../types/fetchPokemonType";

export async function fetchPokemons(limit = 1): Promise<fetchPokemonType[]> {
  try {
    const url = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const resJson = await url.json();

    const results = resJson.results;

    const pokemons = await Promise.all(
      results.map(async () => {
        const min = 1;
        const max = 151;
        const limitId = Math.floor(Math.random() * (max - min + 1) + 1);
        const id = limitId;

        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const speciesJson = await speciesRes.json();

        const fr = speciesJson.names.find(
          (n: fetchPokemonType) => n.language.name === "fr"
        )?.name;

        const minShiny = 1;
        const maxshiny = 512;
        const limitShiny = Math.floor(
          Math.floor(Math.random() * (maxshiny - minShiny + 1)) + minShiny
        );

        let images: string;

        if (limitShiny > 1) {
          images = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        } else {
          images = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
        }

        const songs = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

        return {
          id: Number(id),
          nameFr: fr ?? "Nom non trouvé",
          image: images,
          song: songs,
        };
      })
    );

    return pokemons;
  } catch (err) {
    console.error("❌ Erreur fetch :", err);
    return [];
  }
}
