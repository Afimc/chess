import { Piece } from "./PiecesClass";
import { Player } from "./PlayerClass";
import { v4 as uuidv4 } from "uuid";
import { EColor, EMIT, EPiece, IGameInfo, IHistoryTurn, IMoveData, IPosition, ON, } from "./types";
import { ChessBoard } from "./board";
import { castling, checkForMatt, getPieceToReborn, positionConvertToString, } from "./inGame_functions";

export class Game {
  gameName: string;
  private _password: string;
  playerOne: Player;
  playerTwo: Player | null = null;
  uuid: string;
  board: ChessBoard = new ChessBoard();
  graveyard: Piece[] = [];
  turns: number = 0;
  whitePlayerId: string;
  history: IHistoryTurn[] = [];
  

  constructor(playerOne: Player, password: string, gameName:string) {
    this.gameName = gameName;
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
      gameName: this.gameName,
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
    this.playerOne.socket.emit(EMIT.UPDATEDDATA, data);
    this.playerTwo.socket.emit(EMIT.UPDATEDDATA, data);
  }

  moveToGraveyard(pieceToKill: Piece) {
    this.graveyard.push(pieceToKill);
  }

  resurrection(color:number, type: string, pos: IPosition) {
    const pieceToReborn = getPieceToReborn(this.graveyard,color,type);
    const pieceToSacrrifice = this.board.grid[pos.y][pos.x];
    this.board.grid[pos.y][pos.x] = pieceToReborn[0];
    this.history[0]._pieceToResorect = pieceToReborn[0].type;
    this.graveyard=this.graveyard.filter(p=>p  !== pieceToReborn[0]);
    this.moveToGraveyard(pieceToSacrrifice);
    this.updateData();
  }
 
  addToHistory(pieceToMove: Piece, pieceToKill: Piece, fromPosition: IPosition, toPosition: IPosition, pieceToReborn: Piece) {
    const addTurn: IHistoryTurn = {
      _fromPosition: positionConvertToString(fromPosition),
      _toPosition: positionConvertToString(toPosition),
      _pieceToMove: `${pieceToMove.color === 1 ? "White" : "Black"} ${pieceToMove.type}`,
      _pieceToKill: pieceToKill ? `${pieceToKill.color === 1 ? "White" : "Black"} ${pieceToKill.type}` : null,
      _turn: this.turns.toString(),
      _pieceToResorect: pieceToReborn ? `${pieceToReborn.color === 1 ? "White" : "Black"} ${pieceToReborn.type}` : null,
    };
    this.history.unshift(addTurn);
  }
  
  move(moveData: IMoveData, player: Player) {
    const { fromPosition, toPosition } = moveData;
    const pieceToMove = this.board.grid[fromPosition.y][fromPosition.x];
    if (!pieceToMove) {
      player.socket.emit(EMIT.ERROR, "chosse a piece");
      return;
    }
    const posiblePositions = pieceToMove.posiblePositions2(fromPosition, this.board);
    const aveilablePosiblePositions = posiblePositions.find((positon) => positon?.x === toPosition?.x && positon?.y === toPosition?.y);
    if (!aveilablePosiblePositions) return;
    const pieceToKill = this.board.grid[toPosition.y][toPosition.x];
    if (pieceToKill) this.moveToGraveyard(pieceToKill);
    if (pieceToMove.type === EPiece.KING) castling(this.board.grid,fromPosition,toPosition,pieceToMove);
    if (pieceToMove.type === EPiece.PAWN && (toPosition.y===0||toPosition.y===7)) {
      player.socket.emit(EMIT.PIECEREQUEST);
    }
    this.board.grid[toPosition.y][toPosition.x] = pieceToMove;
    this.board.grid[fromPosition.y][fromPosition.x] = null;
    this.turns = this.turns + 1;
    pieceToMove.setIsMoved = true
    this.addToHistory(pieceToMove, pieceToKill, fromPosition, toPosition, null);
    this.updateData();
    checkForMatt(player, this.board)
  }

  private startListenForEvents() {
    const players = [this.playerOne, this.playerTwo];
    players.forEach(Player => {
      Player.socket.on(ON.MOVE, (moveData: IMoveData) => {
        this.move(moveData, Player);
      });
      Player.socket.on(ON.PIECETOREBORN,(color:number, type:string, pos:IPosition) => { 
        this.resurrection(color, type, pos)
      });
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
    this.playerTwo.socket.emit(EMIT.GAMEMACHED, true);
    this.playerOne.socket.emit(EMIT.GAMEMACHED, true);
    this.updateData();
  }
  
  stopGame() {
    this.playerOne.socket.emit(EMIT.PLAYERLEAVE, true);
    this.playerTwo.socket.emit(EMIT.PLAYERLEAVE, true);
    this.playerOne.socket.offAny();
    this.playerTwo.socket.offAny();
  }
}
