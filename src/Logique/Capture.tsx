import { useState } from "react";

export default function useCapture(loadPokemons: () => void) {
  const [count, setCount] = useState(0);

  const capture = (percentage: number) => {
    setCount((prev) => {
      const random = Math.random() * 100;

      const next = prev + 1;

      if (random < percentage) {
        console.log("ok");
        loadPokemons();
        return 0;
      }

      if ( random > percentage &&  next === 3) {
        console.log("pas ok");

        loadPokemons();
        return 0;
      }
      return next;
    });
  };

  return { count, capture };
}
