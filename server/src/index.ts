var cors = require('cors')
const express = require('express');
const app = express();
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{cors: {origin: "http://localhost:5173"}});
const {onDisconnect, onRequest, onRequestWaitingList, OnGameEnter, sendNewWaitingList, onExit} = require('./tools')
import { Socket } from "socket.io";
import {GamesManager } from "./games"


const gamesManager = new GamesManager()


app.get('/', (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  io.on('connection', (socket: any) => {
    console.log(` user ${socket.id} connected`);
    sendNewWaitingList(socket,gamesManager)
    socket.on('exit', (id:string) => onExit(id,socket,gamesManager, io.emit.bind(io)))
    socket.on('game-enter', (gameId:string,password:string) => OnGameEnter( gameId, password,socket, gamesManager, io.emit.bind(io)) )
    socket.on('request-waitingList',()=>onRequestWaitingList(socket, gamesManager))
    socket.on("disconnect", () => onDisconnect());
    socket.on("game-request", (nickName: string, password: string) => onRequest(nickName, password, socket, io.emit.bind(io), gamesManager));
  });
  
  
  server.listen(3000, () => {
    console.log('listening on *:3000');
  });