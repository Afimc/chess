import { Socket } from "socket.io";

export class Player {
    constructor(private _socket: Socket, private _name: string) {}
  
    public get socket(): Socket {
      return this._socket;
    }
  
    public get name(): string {
      return this._name;
    }
  }
  