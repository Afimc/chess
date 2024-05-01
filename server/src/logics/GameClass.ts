import { Piece } from "./Pieces";
import { Player } from "./PlayerClass";
import { v4 as uuidv4 } from "uuid";
import { EColor, EPiece, IGameInfo, IHistoryTurn, IMoveData, IPosition, TGrid,  } from "./types";
import { ChessBoard } from "./board";
import { blackCastling, checkForMatt, getPieceToReborn, positionConvertToString, whiteCastling } from "./inGame_functions";

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
  resurrection(color:number, type:string, fromPosition:IPosition, toPosition:IPosition,pieceToMove:Piece, pieceToKill:Piece,player:Player){
    const pieceToReborn = getPieceToReborn(this.graveyard,color,type)

    this.board.grid[toPosition.y][toPosition.x] = pieceToReborn[0]
    this.board.grid[fromPosition.y][fromPosition.x] = null;
    this.turns = this.turns + 1;
    this.addToHistory(pieceToMove, pieceToKill, fromPosition, toPosition, pieceToReborn[0]);
    this.graveyard=this.graveyard.filter(p=> p  !== pieceToReborn[0])
    this.moveToGraveyard(pieceToMove)
    this.updateData();
    checkForMatt(player, this.board)
   
  }

  addToHistory(pieceToMove: Piece, pieceToKill: Piece, fromPosition: IPosition, toPosition: IPosition,pieceToReborn:Piece) {
    const addTurn: IHistoryTurn = {
      _fromPosition: positionConvertToString(fromPosition),
      _toPosition: positionConvertToString(toPosition),
      _pieceToMove: `${pieceToMove.color === 1 ? "White" : "Black"} ${pieceToMove.type} `,
      _pieceToKill: pieceToKill ? `${pieceToKill.color === 1 ? "White" : "Black"} ${pieceToKill.type} ` : null,
      _turn: this.turns.toString(),
      _pieceToResorect:pieceToReborn ? `${pieceToReborn.color === 1 ? "White" : "Black"} ${pieceToReborn.type} ` : null,
    };
    this.history.unshift(addTurn);
  }
  

  move(moveData: IMoveData, player: Player) {
    console.log('\n\n*****\n\n')
   
    const { fromPosition, toPosition } = moveData;
    const pieceToMove = this.board.grid[fromPosition.y][fromPosition.x];
    if (!pieceToMove) {
      player.socket.emit("error", "chosse a piece");
      return;
    }
    const posiblePositions = pieceToMove.posiblePositions2(fromPosition,this.board);
    const aveilablePosiblePositions = posiblePositions.find(
      (positon) => positon?.x === toPosition?.x && positon?.y === toPosition?.y
    );
    if (!aveilablePosiblePositions) return;
    const pieceToKill = this.board.grid[toPosition.y][toPosition.x];
    if (pieceToKill) this.moveToGraveyard(pieceToKill);
  

    if(pieceToMove.type === EPiece.KING){ 
      if(pieceToMove.color===0 && toPosition.x===fromPosition.x+2) blackCastling(this.board.grid,fromPosition,toPosition,pieceToMove); 
      if(pieceToMove.color===1 && toPosition.x===fromPosition.x-2) whiteCastling(this.board.grid,fromPosition,toPosition,pieceToMove);
    }

    if(pieceToMove.type === EPiece.PAWN && (toPosition.y===0||toPosition.y===7)){
      player.socket.emit("piece-request")
      player.socket.on('piece-to-reborn',(color,type)=>{ // ???????====>>>?????
        this.resurrection(color, type, fromPosition, toPosition,pieceToMove, pieceToKill,player)
        return ()=>{player.socket.off('piece-to-reborn',this.resurrection)}
      })
    }else{
      this.board.grid[toPosition.y][toPosition.x] = pieceToMove;
      this.board.grid[fromPosition.y][fromPosition.x] = null;
      this.turns = this.turns + 1;
      pieceToMove.setIsMoved = true
      this.addToHistory(pieceToMove, pieceToKill, fromPosition, toPosition, null);
      this.updateData();
      checkForMatt(player, this.board)
    }
    
  }
//?????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  // private startListenForEvents() {
  //   this.playerOne.socket.on("move", (moveData:IMoveData) => {
  //     this.move(moveData, this.playerOne);
  //       this.playerOne.socket.on('piece-to-reborn',(color,type)=>{ 
  //       const { fromPosition, toPosition } = moveData;
  //       const pieceToMove = this.board.grid[fromPosition.y][fromPosition.x];
  //       if (!pieceToMove) {
  //         this.playerOne.socket.emit("error", "chosse a piece");
  //         return;
  //       }
  //     const posiblePositions = pieceToMove.posiblePositions2(fromPosition,this.board);
  //     const aveilablePosiblePositions = posiblePositions.find(
  //       (positon) => positon?.x === toPosition?.x && positon?.y === toPosition?.y
  //     );
  //     if (!aveilablePosiblePositions) return;
  //     const pieceToKill = this.board.grid[toPosition.y][toPosition.x];
  //     if (pieceToKill) this.moveToGraveyard(pieceToKill);
  //         this.resurrection(color, type, fromPosition, toPosition,pieceToMove, pieceToKill,this.playerOne)
  //       })
  //   });

  //   this.playerTwo.socket.on("move", (moveData:IMoveData) => {
  //     this.move(moveData, this.playerTwo);
  //     this.playerTwo.socket.on('piece-to-reborn',(color,type)=>{ 
  //       const { fromPosition, toPosition } = moveData;
  //       const pieceToMove = this.board.grid[fromPosition.y][fromPosition.x];
  //       if (!pieceToMove) {
  //         this.playerOne.socket.emit("error", "chosse a piece");
  //         return;
  //       }
  //       const posiblePositions = pieceToMove.posiblePositions2(fromPosition,this.board);
  //       const aveilablePosiblePositions = posiblePositions.find(
  //         (positon) => positon?.x === toPosition?.x && positon?.y === toPosition?.y
  //       );
  //       if (!aveilablePosiblePositions) return;
  //       const pieceToKill = this.board.grid[toPosition.y][toPosition.x];
  //       if (pieceToKill) this.moveToGraveyard(pieceToKill);
  //           this.resurrection(color, type, fromPosition, toPosition,pieceToMove, pieceToKill,this.playerTwo)
  //     })
  //   });

  // }
//??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
