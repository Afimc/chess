import { Player } from "./PlayerClass";
import {
  EPiece,
  positionConvertToString,
  positionConvertToVector,
  availablePositions,
  knightPositions,
  rookPositions,
  bishopPositions,
} from "./inGame_functions";
import { v4 as uuidv4 } from "uuid";

export interface IGameInfo {
  nickName: string;
  isLocked: boolean;
  id: string;
}

enum EColor {
  BLACK,
  WHITE,
}

class Piece {
  constructor(private _type: EPiece, private _color: EColor) {}

  public get type(): EPiece {
    return this._type;
  }

  public get color(): EColor {
    return this._color;
  }
}

const w_Pawn = new Piece(EPiece.PAWN, EColor.WHITE);
const w_Rook = new Piece(EPiece.ROOK, EColor.WHITE);
const w_Knight = new Piece(EPiece.KNIGHT, EColor.WHITE);
const w_Bishop = new Piece(EPiece.BISHOP, EColor.WHITE);
const w_Queen = new Piece(EPiece.QUEEN, EColor.WHITE);
const w_King = new Piece(EPiece.KING, EColor.WHITE);

const b_Pawn = new Piece(EPiece.PAWN, EColor.BLACK);
const b_Rook = new Piece(EPiece.ROOK, EColor.BLACK);
const b_Knight = new Piece(EPiece.KNIGHT, EColor.BLACK);
const b_Bishop = new Piece(EPiece.BISHOP, EColor.BLACK);
const b_Queen = new Piece(EPiece.QUEEN, EColor.BLACK);
const b_King = new Piece(EPiece.KING, EColor.BLACK);

class ChessBoard {
  grid = [
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
