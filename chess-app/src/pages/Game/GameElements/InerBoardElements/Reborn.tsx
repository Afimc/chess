import './Reborn.scss';
import { gameStore } from "../../../../core/PageStores";
import { socket } from "../../../../core/sockets";
import { updatedDataStore } from "../../../../core/InGameStore";
import { EMIT, IPiece } from "../../../../core/Interfaces";

const Reborn = () => {
  const onRebornRequest = gameStore((state) => state.onRebornRequest);
  const playerColor = updatedDataStore((state) => state.playerColor);
  const graveyard = updatedDataStore((state) => state.graveyard);
  const setOnRebornRequest = gameStore((state) => state.setOnRebornRequest);

  function sendPieceForReborn(color: number, type: string) {
    socket.emit(EMIT.PIECETOREBORN, color, type);
    setOnRebornRequest(false);
  }

  return (
    <div className="reborn">
      {
        onRebornRequest === false
          ? null
          : graveyard.filter(piece => piece._color === playerColor).map((piece: IPiece) => {
            return (
              <div className="pieceToReborn">
                <img onMouseDown={() => sendPieceForReborn(piece._color, piece._type)}
                  src={`piecesImages/${piece?._color === 1 ? 'W' : 'B'}_${piece?._type}.png` || ''} alt="" >
                </img>
              </div>
            );
          })
      }
    </div>
  );
}

export default Reborn;
