import { Piece } from "./Pieces";
import { Player } from "./PlayerClass";
import { v4 as uuidv4 } from "uuid";
import { EColor, IGameInfo, Iposition } from "./types";
import { ChessBoard } from "./board";

export class Game {
  private _password: string;
  playerOne: Player;
  playerTwo: Player | null = null;
  uuid: string;
  board: ChessBoard = new ChessBoard();
  graveyard: Piece[] = [];
  turns:number = 0

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
  updateGrid(){
    const data = {
      updatedBoard: this.board.gridWithPosiblePOsitions,
      turns: this.turns
    }

    this.playerOne.socket.emit('updated-grid',data)
    this.playerTwo.socket.emit('updated-grid',data)
  }

  moveToGraveyard(pieceToKill: Piece) {
    this.graveyard.push(pieceToKill);
  }

  move(moveData:{fromPosition:Iposition,toPosition:Iposition}, player: Player) {
    const { fromPosition, toPosition } = moveData;
    const pieceToMove = this.board.grid[fromPosition.y][fromPosition.x];
    if (!pieceToMove) { 
      player.socket.emit("error", "chosse a piece")
      return
    };
    const posiblePositions = pieceToMove.posiblePositions(fromPosition,this.board)
    const aveilablePosiblePositions = posiblePositions.find((positon)=>positon.x===toPosition.x && positon.y===toPosition.y)
    if(!aveilablePosiblePositions) return;
    const pieceToKill = this.board.grid[toPosition.y][toPosition.x];
    if (pieceToKill) this.moveToGraveyard(pieceToKill);
    this.board.grid[toPosition.y][toPosition.x] = pieceToMove;
    this.turns = this.turns + 1
    this.updateGrid()
  }

  private startListenForEvents() {
    this.playerOne.socket.on("move", (moveData) => {
      this.move(moveData, this.playerOne)
    });

    this.playerTwo.socket.on("move", (moveData) => {
      this.move(moveData, this.playerTwo)
    });
  }

  startGame() {
    const isPlaierOneWhite = Math.random() > 0.5;

    // const colorPlayerOne = isPlaierOneWhite? EColor.WHITE:EColor.BLACK
    // const colorPlayerTwo = isPlaierOneWhite? EColor.BLACK:EColor.WHITE
    // this.playerOne.color =colorPlayerOne;
    // this.playerTwo.color = colorPlayerTwo;

    if (isPlaierOneWhite) {
      this.playerOne.color = EColor.WHITE;
      this.playerTwo.color = EColor.BLACK;
    } else {
      this.playerOne.color = EColor.BLACK;
      this.playerTwo.color = EColor.WHITE;
    }

    const dataGame = {
      info: this.info,
      first: this.playerOne.socket.id,
      second: this.playerTwo.socket.id,
      inittialBord: this.board.gridWithPosiblePOsitions,
      black: isPlaierOneWhite ? this.playerTwo.socket.id : this.playerOne.socket.id,
      white: isPlaierOneWhite ? this.playerOne.socket.id : this.playerTwo.socket.id,
    };
    
    this.startListenForEvents();
    this.playerOne.socket.emit("data-game", dataGame);
    this.playerTwo.socket.emit("data-game", dataGame);
  }
}
