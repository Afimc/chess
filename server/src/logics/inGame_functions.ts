import { Piece } from "./Pieces";
import { Player } from "./PlayerClass";
import { ChessBoard } from "./board";
import { EPiece, IPosition, TGrid } from "./types";

function checkForCheck(boardGridCopy: (Piece | null)[][], test: Piece) {
  const enemyPieces = boardGridCopy.map((row, y) => {
      return row.map((piece, x) => {
        if (!piece) return null;
        return piece.color === test.color
          ? null
          : {
              piece: piece,
              posiblePositions: piece.posiblePositions(
                { x, y },
                boardGridCopy
              ),
            };
      });
  })
    .flat()
    .filter((piece) => piece);

  const checkPositions = enemyPieces.map((piece) => piece.posiblePositions).flat();

  let curentKingPosition: IPosition;
  for (let y = 0; y < boardGridCopy.length; y++) {
    const row = boardGridCopy[y];
    for (let x = 0; x < row.length; x++) {
      const piece = row[x];
      if (piece && piece.type === EPiece.KING && piece.color === test.color) {
        curentKingPosition = { x, y };
      }
    }
  }

  if (!curentKingPosition) return false;
  return checkPositions.some((cp: IPosition) =>cp.x === curentKingPosition.x && cp.y === curentKingPosition.y);
}

export function positionConvertToVector(position: string) {
  const [_x, _y] = position.split("");
  const y = parseInt(_y);
  const arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  let x = arr.indexOf(_x);
  const res = { x: x, y: y };
  return res;
}

export function positionConvertToString(vector: IPosition) {
  const y = vector.y+1;
  const arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const x = arr[vector.x];
  const position = x + y;
  return position;
}

export function posiblePositionsByDirection(fromPosition:IPosition, boardGrid:(null|Piece)[][], directions:IPosition[], range:number){
  const posiblePOsition:IPosition[]=[]
  const myColor = boardGrid[fromPosition.y][fromPosition.x].color

  directions.forEach((d)=>{
      for (let j = 0; j < range; j++) {
          const x = fromPosition.x + d.x*j;
          const y = fromPosition.y + d.y*j;
          const pos = {x,y};
          const conditions = pos.x >= 0 && pos.x < boardGrid[0].length && pos.y >=0 && pos.y < boardGrid.length;
          if(fromPosition.x === x && fromPosition.y === y)continue
          let stopOnNext =false
          if (!conditions) return
          if (boardGrid[pos.y][pos.x] !== null) {
            if(boardGrid[pos.y][pos.x].color !== myColor) {
              stopOnNext = true
            } else {return}
          };
          posiblePOsition.push(pos);
          if (stopOnNext) return
      }
  })
  return posiblePOsition
}

export function checkForMatt(player:Player, board:ChessBoard){
  const enemyPosiblePositions = board.grid.map((row, y) => {
    return row.map((piece, x) => {
      if (!piece) return null;
      return piece.color === player.color? null : piece.posiblePositions2({ x, y },board) 
    })
}).flat(2).filter(pos=>pos!==null)

const isMatt = enemyPosiblePositions.length === 0 ? true : false
// console.log({a:isMatt,b:enemyPosiblePositions.length})
return isMatt
 
}

export function isSafeToMove(fromPosition2: IPosition,toPosition: IPosition,board: ChessBoard,test: Piece) {
  const boardCopy = board.cloneGrid();
  const pieceToMove = boardCopy[fromPosition2.y][fromPosition2.x];
  boardCopy[toPosition.y][toPosition.x] = pieceToMove;
  boardCopy[fromPosition2.y][fromPosition2.x] = null;
  const isCheck = checkForCheck(boardCopy, test);
  return !isCheck;
}

export function blackCastling(grid:TGrid,fromPosition:IPosition, toPosition:IPosition,pieceToMove:Piece){
  const pieceToSwap = grid[7][7]
  grid[toPosition.y][toPosition.x] = pieceToMove;
  grid[fromPosition.y][fromPosition.x] = null;
  grid[7][7] = null
  grid[7][5] = pieceToSwap
}

export function whiteCastling(grid:TGrid,fromPosition:IPosition, toPosition:IPosition,pieceToMove:Piece){
  const pieceToSwap = grid[0][0]
  grid[toPosition.y][toPosition.x] = pieceToMove;
  grid[fromPosition.y][fromPosition.x] = null;
  grid[0][0] = null
  grid[0][2] = pieceToSwap
}