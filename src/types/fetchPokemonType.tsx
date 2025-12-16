export default interface fetchPokemonType {
  id: number;
  nameFr: string;
  language: { name: string };

  image: string;
  song: string;
  taucap: number;
  type: string[];
  trainer: string;
 cartes: { name: string; image: string ,id:number}[];
}
