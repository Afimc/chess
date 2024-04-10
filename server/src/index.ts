var cors = require('cors')
const express = require('express');
const app = express();
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{cors: {origin: "http://localhost:5173"}});
const {onDisconnect, onRequest} = require('./tools')
import { games } from "./games"

interface ISocket {
 
}

app.get('/', (req:any, res:any) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  io.on('connection', (socket:any) => {
    console.log('a user connected');
    io.emit("new-waitingList",games)

    socket.on("disconnect",()=>onDisconnect());
    socket.on("game-request",(nickNameInput:string,PasswordInput:string)=>onRequest(nickNameInput,PasswordInput,socket,io.emit.bind(io)))
  });
  
  
  server.listen(3000, () => {
    console.log('listening on *:3000');
  });