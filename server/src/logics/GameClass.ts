import { Player } from "./PlayerClass";
import { v4 as uuidv4 } from "uuid";

export interface IGameInfo {
  nickName: string;
  isLocked: boolean;
  id: string;
}

export class Game {
  private _password: string;
  playerOne: Player;
  playerTwo: Player | null = null;
  uuid: string;

  constructor(playerOne: Player, password: string) {
    this._password = password;
    this.playerOne = playerOne;
    this.uuid = uuidv4();
  }

  public get password(): string {
    return this._password;
  }

  public get isLocked(): boolean {
    return !!this._password;
  }

  public get info(): IGameInfo {
    return {
      nickName: this.playerOne.name,
      isLocked: this.isLocked,
      id: this.uuid,
    };
  }

  public get isEmpty(): boolean {
    return !this.playerTwo;
  }
}
