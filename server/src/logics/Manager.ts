import { Game } from "./GameClass";
import { Player } from "./PlayerClass";
import { Socket, Server } from "socket.io";
import { IGameInfo } from "./types";

export class GamesManager {
  public _games: Game[] = [];
  constructor(private io: Server) {}

  public get freeGamesInfo(): IGameInfo[] {
    return this._games.filter((game) => game.isEmpty).map((game) => game.info);
  }

  public get allGames(): Game[] {
    return this._games;
  }

  addGame(
    nickName: string,
    password: string,
    gamesManager: GamesManager,
    socket: Socket
  ) {
    const playerOne = new Player(socket, nickName);
    const game = new Game(playerOne, password);
    this._games.push(game);
    this.sendWaitingListToAll(gamesManager);
  }

  sendWaitingListToAll(gamesManager: GamesManager) {
    const freeGamesInfo = gamesManager.freeGamesInfo;
    this.io.emit("new-waitingList", freeGamesInfo);
  }
  sendWaitingListToSinglePlayer(gamesManager: GamesManager, socket: Socket) {
    const freeGamesInfo = gamesManager.freeGamesInfo;
    socket.emit("new-waitingList", freeGamesInfo);
  }

  removeGame(gameId: string, gamesManager: GamesManager) {
    console.log(this._games)
    // const gameToDelete = this._games.find(game =>game.uuid === gameId)
    // gameToDelete.playerOne.socket.emit('player-leave' ,true)
    // gameToDelete.playerTwo.socket.emit('player-leave' ,true)
    console.log({gameId})
    this._games = this._games.filter((game) => {
      game.uuid !== gameId;
      console.log(this._games)
      this.sendWaitingListToAll(gamesManager);
    });
  }

  checkGame(
    gameId: string,
    password: string,
    nickName2: string,
    gamesManager: GamesManager,
    socket: Socket
  ) {
    try {
      const pickedGame = this._games.find((game) => game.uuid === gameId);
      if (!pickedGame.isEmpty) {
        throw new Error("this game already been chosen");
      }
      if (pickedGame.isLocked && pickedGame.password !== password) {
        throw new Error("Incorect Password");
      }
      pickedGame.playerTwo = new Player(socket, nickName2);
      this.sendWaitingListToAll(gamesManager);
      pickedGame.playerTwo.socket.emit("game-mached", true);
      pickedGame.playerOne.socket.emit("game-mached", true);
      pickedGame.startGame() 
     
    } catch (error) {
      socket.emit("error", error.message);
      console.log(error.message)
    }
  }
}
