import { BISHOP, KING, KNIGHT, PAWN, Piece, QUEEN, ROOK } from "./Pieces";
import { EColor, TGrid } from "./types";

const w_Pawn = new PAWN(EColor.WHITE);
const w_Rook = new ROOK(EColor.WHITE);
const w_Rook2 = new ROOK(EColor.WHITE);
const w_Knight = new KNIGHT(EColor.WHITE);
const w_Bishop = new BISHOP(EColor.WHITE);
const w_Queen = new QUEEN(EColor.WHITE);
const w_King = new KING(EColor.WHITE);

const b_Pawn = new PAWN(EColor.BLACK);
const b_Rook = new ROOK(EColor.BLACK);
const b_Rook2 = new ROOK(EColor.BLACK);
const b_Knight = new KNIGHT(EColor.BLACK);
const b_Bishop = new BISHOP(EColor.BLACK);
const b_Queen = new QUEEN(EColor.BLACK);
const b_King = new KING(EColor.BLACK);

export class ChessBoard {
  grid:TGrid= [
    [w_Rook, w_Knight, w_Bishop, w_King, w_Queen, w_Bishop, w_Knight, w_Rook2],
    [w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn],
    [b_Rook, b_Knight, b_Bishop, b_Queen, b_King, b_Bishop, b_Knight, b_Rook2],
  ];

  get gridWithPosiblePOsitions(){
    return this.grid.map((row, y)=>{
      return row.map((piece, x)=>{
        if(!piece)return null
        return {
            piece:piece,
            posiblePositions: piece.posiblePositions2({x, y},this)
        }
      })
    })
  }

  cloneGrid():TGrid{
    return this.grid.map((row)=>row.map((piece)=>piece))
  }


}
 

