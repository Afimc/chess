import { Piece } from "./Pieces";
import { Player } from "./PlayerClass";
import { v4 as uuidv4 } from "uuid";
import { EColor, IGameInfo, IHistoryTurn, IMoveData, IPosition,  } from "./types";
import { ChessBoard } from "./board";
import { positionConvertToString } from "./inGame_functions";

export class Game {
  private _password: string;
  playerOne: Player;
  playerTwo: Player | null = null;
  uuid: string;
  board: ChessBoard = new ChessBoard();
  graveyard: Piece[] = [];
  turns: number = 0;
  whitePlayerId: string;
  history: IHistoryTurn[] = [];

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
      gameID: this.uuid,
      nickName: this.playerOne.name,
      isLocked: this.isLocked,
    };
  }

  public get isEmpty(): boolean {
    return !this.playerTwo;
  }

  updateData() {
    const data = {
      info: this.info,
      updatedBoard: this.board.gridWithPosiblePOsitions,
      turns: this.turns,
      graveyard: this.graveyard,
      whitePlayerId: this.whitePlayerId,
      history: this.history,
    };
    this.playerOne.socket.emit("updated-data", data);
    this.playerTwo.socket.emit("updated-data", data);
  }

  moveToGraveyard(pieceToKill: Piece) {
    this.graveyard.push(pieceToKill);
  }

  addToHistory(pieceToMove: Piece, pieceToKill: Piece, fromPosition: IPosition, toPosition: IPosition,) {
    const addTurn: IHistoryTurn = {
      _fromPosition: positionConvertToString(fromPosition),
      _toPosition: positionConvertToString(toPosition),
      _pieceToMove: `${pieceToMove.color === 1 ? "White" : "Black"} ${pieceToMove.type} `,
      _pieceToKill: pieceToKill ? `${pieceToKill.color === 1 ? "White" : "Black"} ${pieceToKill.type} ` : null,
      _turn: this.turns.toString(),
    };
    this.history.unshift(addTurn);
  }

  move(moveData: IMoveData, player: Player) {
    const { fromPosition, toPosition } = moveData;
    const pieceToMove = this.board.grid[fromPosition.y][fromPosition.x];
    if (!pieceToMove) {
      player.socket.emit("error", "chosse a piece");
      return;
    }
    const posiblePositions = pieceToMove.posiblePositions(
      fromPosition,
      this.board
    );
    const aveilablePosiblePositions = posiblePositions.find(
      (positon) => positon.x === toPosition.x && positon.y === toPosition.y
    );
    if (!aveilablePosiblePositions) return;
    const pieceToKill = this.board.grid[toPosition.y][toPosition.x];
    if (pieceToKill) this.moveToGraveyard(pieceToKill);
    this.board.grid[toPosition.y][toPosition.x] = pieceToMove;
    this.board.grid[fromPosition.y][fromPosition.x] = null;
    this.turns = this.turns + 1;
    this.addToHistory(pieceToMove, pieceToKill, fromPosition, toPosition);
    this.updateData();
  }

  private startListenForEvents() {
    this.playerOne.socket.on("move", (moveData:IMoveData) => {
      this.move(moveData, this.playerOne);
    });

    this.playerTwo.socket.on("move", (moveData:IMoveData) => {
      this.move(moveData, this.playerTwo);
    });
  }

  startGame() {
    const isPlaierOneWhite = Math.random() > 0.5;
    if (isPlaierOneWhite) {
      this.playerOne.color = EColor.WHITE;
      this.playerTwo.color = EColor.BLACK;
    } else {
      this.playerOne.color = EColor.BLACK;
      this.playerTwo.color = EColor.WHITE;
    }
    this.whitePlayerId = isPlaierOneWhite ? this.playerOne.socket.id : this.playerTwo.socket.id;

    this.startListenForEvents();
    this.playerTwo.socket.emit("game-mached", true);
    this.playerOne.socket.emit("game-mached", true);
    this.updateData();
  }
  
  stopGame() {
    this.playerOne.socket.emit("player-leave", true);
    this.playerTwo.socket.emit("player-leave", true);
    this.playerOne.socket.offAny();
    this.playerTwo.socket.offAny();
  }
}
