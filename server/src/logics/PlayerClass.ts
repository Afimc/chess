import { Socket } from "socket.io";
import { EColor } from "./types";

export class Player {
  private _color: null | EColor = null;
  constructor(
    private _socket: Socket,
    private _name: string,
  ) {}

  public get socket(): Socket {
    return this._socket;
  }

  public get name(): string {
    return this._name;
  }

  public set color(color: EColor) {
    this._color = color;
  }

  public get color(): EColor {
    return this._color;
  }
}
