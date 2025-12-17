import { useState } from "react";
import Pokedex from "../components/pokedex";
import type { Carte } from "../types/carte";

interface ModalProps {
  cartesCaptures: Carte[];
}


export default function Modal({ cartesCaptures }: ModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button className='modal-btn'  onClick={handleOpen}>Pokedex</button>

      {open && (
        <div className="Modal" onClick={handleClose}>
          <div
            className="Modal-contenue"
            onClick={(e) => e.stopPropagation()}
          >
            <Pokedex cartesCaptures={cartesCaptures} />
            <button onClick={handleClose}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

