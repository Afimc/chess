import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleSockets } from "./tools";
import { GamesManager } from "./logics/ManagerClass";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const gamesManager = new GamesManager(io);
handleSockets(io, gamesManager);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
