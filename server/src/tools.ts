import { Server, Socket } from "socket.io";
import { GamesManager } from "./logics/Manager";


function handleSockets(io:Server, gamesManager:GamesManager){
  io.on('connection', (socket: Socket) => onConnection(gamesManager, socket));
}

function onConnection( gamesManager:GamesManager, socket:Socket){
    console.log(` user ${socket.id} connected`);
    socket.on("game-request", (nickName: string, password: string) => onRequest(nickName, password, gamesManager, socket));
    socket.on('game-enter', (gameID:string,password:string, nickName2:string) => OnGameEnter( gameID, password,nickName2, socket, gamesManager));
    socket.on('request-waitingList',()=>onRequestWaitingList(socket, gamesManager));
    socket.on('exit', (gameID:string) => onExit(gameID,gamesManager));
    socket.on("disconnect", () => onDisconnect(socket.id,gamesManager));
    sendNewWaitingList(socket,gamesManager);
}

function onRequest(nickName: string,password: string,gamesManager: GamesManager,socket: Socket,) {
    gamesManager.addGame(nickName, password,gamesManager, socket)
}

function onDisconnect(socketid:string,gamesManager:GamesManager) {
  const gameToQuit=gamesManager._games.find(game=>socketid===game.playerOne.socket.id || socketid===game.playerTwo.socket.id)
  const gameToQuitID = gameToQuit?.info.gameID
  gamesManager.removeGame(gameToQuitID,gamesManager)
  console.log("disconnect");
}

function onRequestWaitingList(socket:Socket, gamesManager:GamesManager) {
    sendNewWaitingList(socket,gamesManager)
}

function onExit(gameID:string, gamesManager:GamesManager) {
    gamesManager.removeGame(gameID,gamesManager)
}

function OnGameEnter(gameID:string, password:string,nickName2:string, socket:Socket, gamesManager:GamesManager){
  gamesManager.checkGame(gameID, password, nickName2, gamesManager, socket)
}

function sendNewWaitingList(socket:Socket, gamesManager:GamesManager) {
  gamesManager.sendWaitingListToSinglePlayer(gamesManager, socket)
}


export {handleSockets};
