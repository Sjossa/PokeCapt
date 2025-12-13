

export default interface fetchPokemonType {
  id: number;
  nameFr: string;
  language: { name: string };

  image: string; // sprite ou shiny
  song: string; // lien vers le cri
  taucap: number; // capture rate
  type: string[]
}
