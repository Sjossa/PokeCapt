import { useState } from "react";

export default function useCapture(
  loadPokemons: () => void,
  EquipeChange?: (nouvelleEquipe: string[]) => void
) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const capture = (percentage: number, name: string) => {
    const savedEquipe = localStorage.getItem("Equipe");
    const equipe: string[] = savedEquipe ? JSON.parse(savedEquipe) : [];

    if (equipe.length >= 6) {
      setMessage(
        "L'équipe est pleine. Supprimez un Pokémon avant de capturer."
      );
      return;
    }

    const random = Math.random() * 100;
    const next = count + 1;
    setCount(next);

    if (random < percentage) {
      equipe.push(name);
      localStorage.setItem("Equipe", JSON.stringify(equipe));
      EquipeChange?.(equipe);
      setMessage(`${name} capturé !`);
      setCount(0);
      loadPokemons();
      return;
    }
    if (random >= percentage && next >= 3) {
      setMessage("La capture a échoué !");
      setCount(0);
      loadPokemons();
    }
  };

  return { count, capture, message, setMessage };
}
