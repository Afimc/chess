import { Socket } from "socket.io";
import {v4 as uuidv4} from 'uuid'



interface IGameInfo { 
    nickName: string; 
    isLocked: boolean; 
    id: string;
}



export class GamesManager {
    private _games: Game[] = []
    constructor() {}
    
    public get freeGamesInfo(): IGameInfo[] {
        return this._games
            .filter((game)=>game.isEmpty)
            .map((game)=>game.info)
    }

    public get allGames(): Game[] {
        return this._games;
    }

    addGame(game:Game){
        this._games.push(game)
    }

    removeGame(player:string){
        this._games = this._games.filter((game)=>game.playerOne.name !== player || game.playerOne.socket.id !== player)
        console.log(this._games)

    }
    
}

export class Player {
    constructor(
        private _socket: Socket, 
        private _name: string,
    ) {}

    
    public get socket() : Socket {
        return this._socket;
    }

    
    public get name() : string {
        return this._name;
    }
}

export class Game {
    private password: string;
    playerOne: Player;
    playerTwo: Player | null = null;
    uuid: string;

    constructor(playerOne: Player, password: string){
        this.password = password;
        this.playerOne = playerOne;
        this.uuid = uuidv4();
    }

    public get isLocked() : boolean {
        return !!this.password
    }

    public get info() : IGameInfo {
        return {
            nickName: this.playerOne.name,
            isLocked: this.isLocked,
            id: this.uuid
        }    
    }
    
    public get isEmpty() : boolean {
        return !this.playerTwo
    }
    
    
}