import { useEffect, useState } from "react";
import dark from "../../public/assets/dark.webp"
import light from "../../public/assets/ho-oh_lugia.webp"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => localStorage.getItem("theme") as "light" | "dark" || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
   <button  className='theme' onClick={toggleTheme} aria-label="Changer le thème">
  {theme === 'light' ? (
    <img src={light} alt="Activer le mode sombre" />
  ) : (
    <img src={dark} alt="Activer le mode sombre" />
  )}
</button>

  );
}
