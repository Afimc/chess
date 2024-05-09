import './Graveyard.scss';
import { useState } from "react";
import { updatedDataStore } from "../../../../core/InGameStore";

const Graveyard = (props: { color: number }) => {
  const graveyard = updatedDataStore((state) => state.graveyard);
  const [whitePiecesFromGraveyard, setWhitePiecesFromGraveyard] = useState<string[]>([]);
  const [blackPiecesFromGraveyard, setBlackPiecesFromGraveyard] = useState<string[]>([]);

  function getGraveyard(color: number) {
    const piecesFromGraveyard = graveyard.filter(piece => piece._color === color).map((piece) => {
      const color = piece?._color === 1 ? 'W' : 'B';
      const type = piece?._type;
      return `${color}_${type}`;
    })
    color === 1 ? setWhitePiecesFromGraveyard(piecesFromGraveyard) : setBlackPiecesFromGraveyard(piecesFromGraveyard);
  }

  return (
    <>
      {
        props.color === 1
          ? <div className="graveyard" onMouseLeave={() => setWhitePiecesFromGraveyard([])} onMouseOver={() => getGraveyard(props.color)}>
            {
              whitePiecesFromGraveyard.map((piece) => {
                return (
                  <img id="graveyardImages" src={`piecesImages/${piece}.png` || ''} alt="" />
                );
              })
            }
          </div>
          : <div className="graveyard" onMouseLeave={() => setBlackPiecesFromGraveyard([])} onMouseOver={() => getGraveyard(props.color)} >
            {
              blackPiecesFromGraveyard.map((piece) => {
                return (
                  <img id="graveyardImages" src={`piecesImages/${piece}.png` || ''} alt="" />
                );
              })
            }
          </div>
      }
    </>
  );
}

export default Graveyard;
