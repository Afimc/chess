import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface IGameInfo {
  nickName: string;
  isLocked: boolean;
  id: string;
}


export class Player {
  constructor(private _socket: Socket, private _name: string) {}

  public get socket(): Socket {
    return this._socket;
  }

  public get name(): string {
    return this._name;
  }
}


export class Game {
  private _password: string;
  playerOne: Player;
  playerTwo: Player | null = null;
  uuid: string;



  constructor(playerOne: Player, password: string) {
    this._password = password;
    this.playerOne = playerOne;
    this.uuid = uuidv4();
  }

  
  public get password() : string {
    return this._password
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


}


export class GamesManager {
  private _games: Game[] = [];
  constructor() {}

  public get freeGamesInfo(): IGameInfo[] {
    return this._games.filter((game) => game.isEmpty).map((game) => game.info);
  }

  public get allGames(): Game[] {
    return this._games;
  }

  addGame(game: Game) {
    this._games.push(game);
  }

  removeGame(id: string) {
    this._games = this._games.filter((game) => {
      game.uuid !== id || game.playerOne.socket.id !== id
    });
  }

  checkGame(gameId:string, password:string, socket:Socket){
    const pickedGame=this._games.find((game)=>game.uuid===gameId)
    if (pickedGame.isEmpty===true){
      pickedGame.playerTwo = new Player(socket,socket.id)
      if(pickedGame.isLocked===false){
        pickedGame.playerTwo.socket.emit('game-mached', true)
        pickedGame.playerOne.socket.emit('game-mached', true)
      }else if(pickedGame.password === password){
            pickedGame.playerTwo.socket.emit('game-mached', true)
            pickedGame.playerOne.socket.emit('game-mached', true)
          }      
      }
    }
}
