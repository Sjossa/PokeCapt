import { useState } from "react";

export default function useCapture(
  loadPokemons: () => void,
  EquipeChange?: (nouvelleEquipe: string[]) => void
) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const capture = (percentage: number, name: string) => {
    setCount((prev) => {
      const savedEquipe = localStorage.getItem("Equipe");
      const equipe = savedEquipe ? JSON.parse(savedEquipe) : [];

      const random = Math.random() * 100;
      const next = prev + 1;

      if (random < percentage) {
        if (equipe.length >= 6) {
          setMessage("Veuillez choisir un Pokémon à supprimer");
        } else {
          equipe.push(name);
          localStorage.setItem("Equipe", JSON.stringify(equipe));
          setMessage(`${name} capturé !`);
          if (EquipeChange) EquipeChange(equipe);

          loadPokemons();
        }
        return 0;
      }

      if (random >= percentage && next === 3) {
        setMessage("La capture a échoué !");
        loadPokemons();
        return 0;
      }

      return next;
    });
  };

  return { count, capture, message, setMessage };
}
