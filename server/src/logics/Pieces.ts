import { ChessBoard } from "./board";
import { posiblePositionsByDirection } from "./inGame_functions";
import { EColor, EPiece, IPosition, TGrid } from "./types";

//не може да местиш фигура ако поставяш царя ти в шах
//при шах не може да си пак шах след хода или местиш царя или прикриваш
//неможе царя да се мести там където ще бъдеш шах

export class Piece {
  constructor(private _type: EPiece, private _color: EColor) {}

  public get type(): EPiece {
    return this._type;
  }

  public get color(): EColor {
    return this._color;
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid): IPosition[] {
    return [];
  }

  posiblePositions2(fromPosition: IPosition, board: ChessBoard): IPosition[] {
    const posiblePOsition = this.posiblePositions(fromPosition,board.grid).filter((pos) => {
      const isSafe = isSafeToMove(fromPosition, pos, board, this);
      console.log({ isSafe, pos });
      return isSafe;
    });
    return posiblePOsition;
  }
}

export class PAWN extends Piece {
  constructor(color: EColor) {
    super(EPiece.PAWN, color);
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid) {
    const { x, y } = fromPosition;
    const posiblePositions: IPosition[] = [];
    const j =
      this.color === EColor.WHITE
        ? { _y: y + 1, _y2: y + 2, pos: 1 }
        : { _y: y - 1, _y2: y - 2, pos: 6 };
    const isCurentPositionInBoard =
      x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
    const isTestPositionInBoard = j._y >= 0 && j._y < grid.length;
    if (isCurentPositionInBoard && isTestPositionInBoard) {
      if (y === j.pos && grid[j._y][x] === null && grid[j._y2][x] === null)
        posiblePositions.push({ x: x, y: j._y2 });
      if (grid[j._y][x] === null) posiblePositions.push({ x: x, y: j._y });
      if (grid[j._y][x + 1] && grid[j._y][x + 1].color !== this.color)
        posiblePositions.push({ x: x + 1, y: j._y });
      if (grid[j._y][x - 1] && grid[j._y][x - 1].color !== this.color)
        posiblePositions.push({ x: x - 1, y: j._y });
    }
    return posiblePositions;
  }
}

export class ROOK extends Piece {
  constructor(color: EColor) {
    super(EPiece.ROOK, color);
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid) {
    const directions: IPosition[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    const posiblePOsition: IPosition[] = posiblePositionsByDirection(
      fromPosition,
      grid,
      directions,
      8
    );
    return posiblePOsition;
  }
}

export class KNIGHT extends Piece {
  constructor(color: EColor) {
    super(EPiece.KNIGHT, color);
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid) {
    const { x, y } = fromPosition;
    const knightPositions: IPosition[] = [
      { x: x - 2, y: y + 1 },
      { x: x - 2, y: y - 1 },
      { x: x + 2, y: y + 1 },
      { x: x + 2, y: y - 1 },

      { x: x - 1, y: y + 2 },
      { x: x - 1, y: y - 2 },
      { x: x + 1, y: y + 2 },
      { x: x + 1, y: y - 2 },
    ];
    const filteredKnightPositions = knightPositions
      .filter(
        //?????????????????????????????????????????????????????????
        (pos) =>
          pos.x >= 0 &&
          pos.y >= 0 &&
          pos.x < grid[0].length &&
          pos.y < grid.length //?????????????
      )
      .filter((avPos) =>
        grid[avPos.y][avPos.x]
          ? grid[avPos.y][avPos.x].color !== this.color
          : true
      ); //?????
    return filteredKnightPositions;
  }
}

export class BISHOP extends Piece {
  constructor(color: EColor) {
    super(EPiece.BISHOP, color);
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid) {
    const directions: IPosition[] = [
      { x: +1, y: +1 },
      { x: +1, y: -1 },
      { x: -1, y: +1 },
      { x: -1, y: -1 },
    ];
    const posiblePositions: IPosition[] = posiblePositionsByDirection(
      fromPosition,
      grid,
      directions,
      8
    );
    return posiblePositions;
  }
}

export class QUEEN extends Piece {
  constructor(color: EColor) {
    super(EPiece.QUEEN, color);
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid) {
    const directions: IPosition[] = [
      { x: 1, y: 0 },
      { x: +1, y: +1 },
      { x: -1, y: 0 },
      { x: +1, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: +1 },
      { x: 0, y: -1 },
      { x: -1, y: -1 },
    ];
    const posiblePositions: IPosition[] = posiblePositionsByDirection(
      fromPosition,
      grid,
      directions,
      8
    );
    return posiblePositions;
  }
}

export class KING extends Piece {
  constructor(color: EColor) {
    super(EPiece.KING, color);
  }

  posiblePositions(fromPosition: IPosition, grid: TGrid) {
    const directions: IPosition[] = [
      { x: 1, y: 0 },
      { x: +1, y: +1 },
      { x: -1, y: 0 },
      { x: +1, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: +1 },
      { x: 0, y: -1 },
      { x: -1, y: -1 },
    ];
    const posiblePositions: IPosition[] = posiblePositionsByDirection(
      fromPosition,
      grid,
      directions,
      2
    );

    //   const enemyPieces = board.grid.map((row ,y)=>{
    //     return row.map((piece,x)=>{
    //         if (!piece )return null
    //         if(piece.type===EPiece.KING)return null
    //         return piece.color === this.color? null : {
    //             piece:piece,
    //             posiblePositions: piece.posiblePositions({x, y},board)
    //         }
    //     })
    //   }).flat().filter(piece=>piece)
    //   const checkPositions = enemyPieces.map(piece=>piece.posiblePositions).flat()

    //   const finalPosition = posiblePositions.filter(pos=>{
    //     const q = checkPositions.some(cp=>cp.x===pos.x && cp.y===pos.y)
    //     return !q
    //   })
    //   console.log({finalPosition})
    return posiblePositions;
  }
}

function checkForCheck(boardGridCopy: (Piece | null)[][], test: Piece) {
  const enemyPieces = boardGridCopy.map((row, y) => {
      return row.map((piece, x) => {
        if (!piece) return null;
        if (piece.type === EPiece.KING) return null;
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

function isSafeToMove(fromPosition2: IPosition,toPosition: IPosition,board: ChessBoard,test: Piece) {
  const boardCopy = board.cloneGrid();
  const pieceToMove = boardCopy[fromPosition2.y][fromPosition2.x];
  boardCopy[toPosition.y][toPosition.x] = pieceToMove;
  boardCopy[fromPosition2.y][fromPosition2.x] = null;
  const isCheck = checkForCheck(boardCopy, test);
  return !isCheck;
}
