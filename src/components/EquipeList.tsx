type Props = {
  equipes: string[];
  favoris: string[];
  onRemove: (index: number) => void;
  onToggleFavori: (name: string) => void;
};

export default function EquipeList({
  equipes,
  favoris,
  onRemove,
  onToggleFavori,
}: Props) {
  return (
    <ul className="equipes">
      {equipes.map((e, index) => {
        const isFavori = favoris.includes(e);

        return (
          <li
            key={index}
            onClick={() => onRemove(index)}
            title={
              isFavori
                ? "Pokémon favori (protégé)"
                : "Cliquer pour retirer de l'équipe"
            }
            style={{
              cursor: isFavori ? "not-allowed" : "pointer",
              opacity: isFavori ? 1 : 0.9,
            }}
          >
            {e}
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                onToggleFavori(e);
              }}
              style={{
                marginLeft: 8,
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                color: isFavori ? "gold" : "#999",
              }}
            >
              ★
            </button>
          </li>
        );
      })}
    </ul>
  );
}
