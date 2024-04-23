import { Piece } from "./Pieces";
import { Player } from "./PlayerClass";
import { v4 as uuidv4 } from "uuid";
import { EColor, IGameInfo, Iposition } from "./types";
import { ChessBoard } from "./board";
import { Socket } from "socket.io";
import { positionConvertToString } from "./inGame_functions";

export class Game {
  private _password: string;
  playerOne: Player; 
  playerTwo: Player | null = null;
  uuid: string;
  board: ChessBoard = new ChessBoard();
  graveyard: Piece[] = [];
  turns:number = 0;
  white:string
  history:string[] = []

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
  updateData(){
    const data = {
      info:this.info,
      updatedBoard: this.board.gridWithPosiblePOsitions,
      turns: this.turns,
      graveyard : this.graveyard,
      white:this.white,
      history:this.history
      // playerOne: this.playerOne.socket.id,
      // playerTwo: this.playerTwo.socket.id,
      
    }
    this.playerOne.socket.emit('updated-data',data)
    this.playerTwo.socket.emit('updated-data',data)
  }

  moveToGraveyard(pieceToKill: Piece) {
    this.graveyard.push(pieceToKill);
  }

  addToHistory(pieceToMove:Piece,pieceToKill:Piece,fromPosition:Iposition,toPosition:Iposition){
    const _fromPosition = positionConvertToString(fromPosition)
    const _toPosition = positionConvertToString(toPosition)
    const _pieceToMove = `${pieceToMove.color === 1 ?'White':'Black'} ${pieceToMove.type} `
    const movingAction = `!!! on turn ${this.turns} ${_pieceToMove} been moved from ${_fromPosition} to ${_toPosition}  `
    this.history.push(movingAction)
    if(!pieceToKill) return
    const _pieceToKill = `${pieceToKill.color === 1 ?'White':'Black'} ${pieceToKill.type} `
    const kilingAction = ` on this move ${_pieceToKill} been send to the graveyard `
    this.history.push(kilingAction)
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
    this.board.grid[fromPosition.y][fromPosition.x] = null;
    this.turns = this.turns + 1
    this.addToHistory(pieceToMove,pieceToKill,fromPosition,toPosition)
    this.updateData()
    
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

    if (isPlaierOneWhite) {
      this.playerOne.color = EColor.WHITE;
      this.playerTwo.color = EColor.BLACK;
    } else {
      this.playerOne.color = EColor.BLACK;
      this.playerTwo.color = EColor.WHITE;
    }
    this.white=isPlaierOneWhite ? this.playerOne.socket.id : this.playerTwo.socket.id
    // const dataGame = {
    //   // info: this.info,
    //   // first: isPlaierOneWhite? this.playerOne.socket.id : this.playerTwo.socket.id,
    //   // second: isPlaierOneWhite? this.playerTwo.socket.id : this.playerOne.socket.id,
    //   // inittialBord: this.board.gridWithPosiblePOsitions, 
    //   // black: isPlaierOneWhite ? this.playerTwo.socket.id : this.playerOne.socket.id,
    //   white: isPlaierOneWhite ? this.playerOne.socket.id : this.playerTwo.socket.id,
    // };

    this.startListenForEvents();
    // this.playerOne.socket.emit("data-game", dataGame);
    // this.playerTwo.socket.emit("data-game", dataGame);
    this.updateData()
  }
}
