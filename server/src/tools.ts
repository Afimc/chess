import { Server, Socket } from "socket.io";
import { GamesManager } from "./logics/Manager";


function handleSockets(io:Server, gamesManager:GamesManager){
  io.on('connection', (socket: Socket) => onConnection(gamesManager, socket));
}

function onConnection( gamesManager:GamesManager, socket:Socket){
  console.log(` user ${socket.id} connected`);
    sendNewWaitingList(socket,gamesManager);
    socket.on('exit', (gameId:string) => onExit(gameId,gamesManager));
    socket.on('game-enter', (gameId:string,password:string, nickName2:string) => OnGameEnter( gameId, password,nickName2, socket, gamesManager));
    socket.on('request-waitingList',()=>onRequestWaitingList(socket, gamesManager));
    socket.on("disconnect", () => onDisconnect());
    socket.on("game-request", (nickName: string, password: string) => onRequest(nickName, password, gamesManager, socket));
}

function onRequest(
  nickName: string,
  password: string,
  gamesManager: GamesManager,
  socket: Socket,
  ) {
  gamesManager.addGame(nickName, password,gamesManager, socket)
}

function onDisconnect() {
  console.log("disconnect");
}

function onRequestWaitingList(socket:Socket, gamesManager:GamesManager){
    sendNewWaitingList(socket,gamesManager)
}

function onExit(gameId:string, gamesManager:GamesManager){
    gamesManager.removeGame(gameId,gamesManager)
}

function OnGameEnter(gameId:string, password:string,nickName2:string, socket:Socket, gamesManager:GamesManager){
  gamesManager.checkGame(gameId, password, nickName2, gamesManager, socket)
}

function sendNewWaitingList(socket:Socket, gamesManager:GamesManager){
  gamesManager.sendWaitingListToSinglePlayer(gamesManager, socket)
}


export {handleSockets};
