import { Socket } from "socket.io";
import { Game, Player,GamesManager} from "./games";


function sendNewWaitingList(socket:Socket, gamesManager:GamesManager){
    const freeGamesInfo = gamesManager.freeGamesInfo
    socket.emit("new-waitingList", freeGamesInfo);
}

function onDisconnect() {
  console.log("disconnect");
}

function onRequestWaitingList(socket:Socket, gamesManager:GamesManager){
    sendNewWaitingList(socket,gamesManager)
}

function onExit(id:string, socket:Socket, gamesManager:GamesManager, ioEmit:any){
    gamesManager.removeGame(id)
    const freeGamesInfo = gamesManager.freeGamesInfo
    ioEmit("new-waitingList", freeGamesInfo);
}

function OnGameEnter(player:string,gameName:string, socket:Socket, gamesManager:GamesManager,ioEmit:any){
    socket.emit('game-mached',true)
    gamesManager.removeGame(gameName)
    const freeGamesInfo = gamesManager.freeGamesInfo
    ioEmit("new-waitingList", freeGamesInfo);
}


function onRequest(
  nickName: string,
  password: string,
  socket: any,
  ioEmit: any,
  gamesManager: GamesManager
) {
  const playerOne = new Player(socket, nickName);
  const game = new Game(playerOne, password);

  gamesManager.addGame(game)
  const freeGamesInfo = gamesManager.freeGamesInfo
  ioEmit("new-waitingList", freeGamesInfo);
}

module.exports = { onDisconnect, onRequest, onRequestWaitingList, OnGameEnter, sendNewWaitingList, onExit};
