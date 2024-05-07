import { CreateBoard } from "./inGame_functions";
import { TGrid } from "./types";

export class ChessBoard {
  grid: TGrid = CreateBoard();

  get gridWithPosiblePOsitions(){
    return this.grid.map((row, y) => {
      return row.map((piece, x) => {
        if(!piece)return null;
        return {
            piece: piece,
            posiblePositions: piece.posiblePositions2({x, y}, this)
        }
      });
    });
  }

  cloneGrid(): TGrid{
    return this.grid.map((row) => row.map((piece) => piece));
  }


}
 

