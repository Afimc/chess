import { Server, Socket } from "socket.io";
import { GamesManager } from "./logics/ManagerClass";
import { ON } from "./logics/types";

function handleSockets(io: Server, gamesManager: GamesManager) {
  io.on(ON.CONNECTION, (socket: Socket) => onConnection(gamesManager, socket));
}

function onConnection( gamesManager: GamesManager, socket: Socket) {
    console.log(`User ${socket.id} connected`);
    socket.on(ON.GAMEREQUEST, (nickName: string, password: string, gameName: string) => onRequest(nickName, password, gameName, gamesManager, socket));
    socket.on(ON.GAMEENTER, (gameID: string, password: string, nickName2: string) => OnGameEnter(gameID, password, nickName2, socket, gamesManager));
    socket.on(ON.REQUESTWAITINGLIST, () => onRequestWaitingList(socket, gamesManager));
    socket.on(ON.EXIT, (gameID: string) => onExit(gameID, gamesManager));
    socket.on(ON.DISCONNECT, () => onDisconnect(socket.id, gamesManager));
    sendNewWaitingList(socket, gamesManager);
}

function onRequest(nickName: string, password: string, gameName: string, gamesManager: GamesManager, socket: Socket) {
    gamesManager.addGame(nickName, password, gameName, gamesManager, socket);
}

function onDisconnect(socketid: string, gamesManager: GamesManager) {
  const gameToQuit = gamesManager._games.find(game => socketid === game.playerOne.socket.id || socketid === game.playerTwo.socket.id);
  const gameToQuitID = gameToQuit?.info.gameID;
  gamesManager.removeGame(gameToQuitID, gamesManager);
  console.log("disconnect");
}

function onRequestWaitingList(socket: Socket, gamesManager: GamesManager) {
    sendNewWaitingList(socket, gamesManager);
}

function onExit(gameID: string, gamesManager: GamesManager) {
    gamesManager.removeGame(gameID, gamesManager);
}

function OnGameEnter(gameID: string, password: string, nickName2: string, socket: Socket, gamesManager: GamesManager) {
  gamesManager.checkGame(gameID, password, nickName2, gamesManager, socket);
}

function sendNewWaitingList(socket: Socket, gamesManager: GamesManager) {
  gamesManager.sendWaitingListToSinglePlayer(gamesManager, socket);
}

export {handleSockets};
