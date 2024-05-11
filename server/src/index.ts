import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleSockets } from "./tools";
import { GamesManager } from "./logics/ManagerClass";
import * as DOTENV from "dotenv";

DOTENV.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const gamesManager = new GamesManager(io);
handleSockets(io, gamesManager);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
