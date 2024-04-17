import { Player } from "./PlayerClass";
import {
  EPiece,
  EColor,
  Iposition,
  posiblePositionsByDirection,

} from "./inGame_functions";
import { v4 as uuidv4 } from "uuid";

export interface IGameInfo {
  nickName: string;
  isLocked: boolean;
  id: string;
}


export class Piece {
  constructor(private _type: EPiece, private _color: EColor) {}

  public get type(): EPiece {
    return this._type;
  }

  public get color(): EColor {
    return this._color;
  }

  posiblePositions(fromPosition:Iposition, board:ChessBoard):Iposition[]{
    return []
  }

  

  
}

class PAWN extends Piece{
    constructor(color: EColor){
        super(EPiece.PAWN, color)
    }
}


class ROOK extends Piece{
    constructor(color: EColor){
        super(EPiece.ROOK, color)
    }
    posiblePositions(fromPosition:Iposition, board:ChessBoard){
        const directions:Iposition[] =[
            {x:1, y:0},
            {x:-1, y:0},
            {x:0, y:1},
            {x:0, y:-1}
        ]
        const posiblePOsition:Iposition[] = posiblePositionsByDirection(fromPosition, board.grid,directions,8)
        return posiblePOsition;
    }
}

class KNIGHT extends Piece{
    constructor(color: EColor){
        super(EPiece.KNIGHT, color)
    }
    posiblePositions(fromPosition: Iposition, board: ChessBoard) {
        const {x,y} = fromPosition
        const knightPositions:Iposition[] = [
            { x: x - 2, y: y + 1 },
            { x: x - 2, y: y - 1 },
            { x: x + 2, y: y + 1 },
            { x: x + 2, y: y - 1 },
        
            { x: x - 1, y: y + 2 },
            { x: x - 1, y: y - 2 },
            { x: x + 1, y: y + 2 },
            { x: x + 1, y: y - 2 },
          ];
          const filteredKnightPositions = knightPositions.filter(
            (pos) => (pos.x >= 0 && pos.y >= 0 && pos.x < board.grid[0].length && pos.y < board.grid.length)
          );
          return filteredKnightPositions;
    }
}

class BISHOP extends Piece{
    constructor(color: EColor){
        super(EPiece.BISHOP, color)
    }

    posiblePositions(fromPosition:Iposition, board:ChessBoard){
        const directions:Iposition[] =[
            {x:+1, y:+1},
            {x:+1, y:-1},
            {x:-1, y:+1},
            {x:-1, y:-1}
        ]
        const posiblePositions:Iposition[]=posiblePositionsByDirection(fromPosition,board.grid,directions,8)
        return posiblePositions;
    }
}

class QUEEN extends Piece{
    constructor(color: EColor){
        super(EPiece.QUEEN, color)
    }
    posiblePositions(fromPosition:Iposition, board:ChessBoard){
        const directions:Iposition[] =[
            {x:1, y:0}, {x:+1, y:+1},
            {x:-1, y:0},{x:+1, y:-1},
            {x:0, y:1}, {x:-1, y:+1},
            {x:0, y:-1}, {x:-1, y:-1}
        ]
        const posiblePositions:Iposition[]=posiblePositionsByDirection(fromPosition,board.grid,directions,8)
        return posiblePositions;

    }
}

class KING extends Piece{
    constructor(color: EColor){
        super(EPiece.KING, color)
    }
    posiblePositions(fromPosition:Iposition, board:ChessBoard){
        const directions:Iposition[] =[
            {x:1, y:0}, {x:+1, y:+1},
            {x:-1, y:0},{x:+1, y:-1},
            {x:0, y:1}, {x:-1, y:+1},
            {x:0, y:-1}, {x:-1, y:-1}
        ]
        const posiblePositions:Iposition[]=posiblePositionsByDirection(fromPosition,board.grid,directions,1)
        return posiblePositions;

    }
}


const w_Pawn = new PAWN(EColor.WHITE);
const w_Rook = new ROOK(EColor.WHITE);
const w_Knight = new KNIGHT(EColor.WHITE);
const w_Bishop = new BISHOP(EColor.WHITE);
const w_Queen = new QUEEN(EColor.WHITE);
const w_King = new KING(EColor.WHITE);

const b_Pawn = new PAWN(EColor.BLACK);
const b_Rook = new ROOK(EColor.BLACK);
const b_Knight = new KNIGHT(EColor.BLACK);
const b_Bishop = new BISHOP(EColor.BLACK);
const b_Queen = new QUEEN(EColor.BLACK);
const b_King = new KING(EColor.BLACK);

class ChessBoard {
  grid:(null|Piece)[][] = [
    [w_Rook, w_Knight, w_Bishop, w_King, w_Queen, w_Bishop, w_Knight, w_Rook],
    [w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn, w_Pawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn, b_Pawn],
    [b_Rook, b_Knight, b_Bishop, b_Queen, b_King, b_Bishop, b_Knight, b_Rook],
  ];
}

export class Game {
  private _password: string;
  playerOne: Player;
  playerTwo: Player | null = null;
  uuid: string;
  board: ChessBoard = new ChessBoard();

  constructor(playerOne: Player, password: string) {
    this._password = password;
    this.playerOne = playerOne;
    this.uuid = uuidv4();
  }

  public get password(): string {
    return this._password;
  }

  public get isLocked(): boolean {
    return !!this._password;
  }

  public get info(): IGameInfo {
    return {
      nickName: this.playerOne.name,
      isLocked: this.isLocked,
      id: this.uuid,
    };
  }

  public get isEmpty(): boolean {
    return !this.playerTwo;
  }
  move() {
    const fromPositionX = 0;
    const fromPositionY = 3;
    const toPositionX = 2;
    const toPositionY = 1;
    const isAbleToMove = true;

    this.board.grid[toPositionY][toPositionX] =
      this.board.grid[fromPositionY][fromPositionX];
    this.board.grid[fromPositionY][fromPositionX] = null;
  }

  private startListenForEvents() {
    this.playerOne.socket.on("move", (moveData) => {});

    this.playerTwo.socket.on("move", (moveData) => {});
  }

  startGame() {
    const dataGame = {
      info: this.info,
      first: this.playerOne.socket.id,
      second: this.playerTwo.socket.id,
      updatedBoard: this.board,
    };
    this.startListenForEvents();

    this.playerOne.socket.emit("data-game", dataGame);
  }
}


const chessBoard = new ChessBoard()

const res = chessBoard.grid[0][0].posiblePositions({x:0, y:3}, chessBoard)
console.log(res)


// on move to swap positions and send  it to graveard 
