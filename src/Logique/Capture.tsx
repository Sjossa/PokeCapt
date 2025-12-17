import { useState } from "react";

async function showNotification(title: string, options?: NotificationOptions) {
  if (!("serviceWorker" in navigator)) return;
  if (Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification(title, options);
}

export default function useCapture(
  loadPokemons: () => void,
  EquipeChange?: (nouvelleEquipe: string[]) => void
) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const resetCount = () => setCount(0);

  const capture = async (percentage: number, name: string) => {
    const savedEquipe = localStorage.getItem("Equipe");
    const equipe: string[] = savedEquipe ? JSON.parse(savedEquipe) : [];

    if (equipe.length === 6) {
      await showNotification("Nouvelle alerte PWA !", {
        body: "L'équipe est pleine. Supprimez un Pokémon avant de capturer.",
        icon: "/icons/pwa-192x192.png",
      });
      return;
    }

    const random = Math.random() * 100;
    const next = count + 1;
    setCount(next);

    if (random < percentage) {
      equipe.push(name);
      localStorage.setItem("Equipe", JSON.stringify(equipe));
      EquipeChange?.(equipe);

      await showNotification("Nouvelle alerte PWA !", {
        body: `Vous avez attrapé ${name} !`,
        icon: "/icons/pwa-192x192.png",
      });

      setCount(0);
      loadPokemons();
      return;
    }

    if (next >= 3) {
      await showNotification("Nouvelle alerte PWA !", {
        body: `${name} s'est enfui.`,
        icon: "/icons/pwa-192x192.png",
      });

      setCount(0);
      loadPokemons();
    }
  };

  return { count, capture, message, setMessage, resetCount };
}
