import type fetchPokemonType from "../types/fetchPokemonType";

export async function fetchPokemons(): Promise<fetchPokemonType[]> {
  try {
    const min = 1;
    const max = 151;
    const limitId = Math.floor(Math.random() * (max - min + 1) + 1);
    const id = limitId;

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesJson = await speciesRes.json();

    const fr = speciesJson.names.find(
      (n: fetchPokemonType) => n.language.name === "fr"
    )?.name;

    const taucap = speciesJson.capture_rate;

    const minShiny = 1;
    const maxShiny = 512;
    const limitShiny = Math.floor(Math.random() * (maxShiny - minShiny + 1) + minShiny);

    let images: string;
    if (limitShiny > 1) {
      images = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    } else {
      images = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
    }

    const songs = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

    console.log(taucap);
    console.log("lid", Number(id));

   return [{
  id: Number(id),
  nameFr: fr ?? "Nom non trouvé",
  language: { name: "fr" }, // valeur fixe si tu veux
  image: images,
  song: songs,
  taucap: taucap,
}];
  } catch (err) {
    console.error("❌ Erreur fetch :", err);
    return [];
  }
}
