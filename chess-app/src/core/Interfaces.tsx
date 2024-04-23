

export interface IRow{
    piece: IPiece,
    posiblePositions: Iposition[]
}
export interface Iposition {
    x: number,
    y: number,
  }

export interface IGameInfo {
    nickName: string;
    isLocked: boolean;
    id: string;
}

export interface IPiece{
    _color: number,
    _type: '',
}

export interface IGameInfo {
    nickName: string;
    isLocked: boolean;
    id: string;
  }

export interface IUpdatedData{
    info:IGameInfo;
    updatedBoard:(IPiece|{piece:IPiece,posiblePositions:Iposition[]});
    turns:number;
    graveyard:IPiece[];
    white:string;
    history:string[]
}

export interface IGameStore {
    inGame: boolean;
    onNewGame: boolean;
  
    startStopGame: (s: boolean) => void;
    setOnNewGame: (s: boolean) => void;
}

export interface IUpdatedDataStore{
    waitingList: IGameInfo[];
    playerColor:number;
    board:any;
    info:IGameInfo;
    updatedBoard:(IPiece|{piece:IPiece,posiblePositions:Iposition[]});
    turns:number;
    graveyard:IPiece[];
    white:string;
    history:string[]

    setWaitingList: (s: IGameInfo[]) => void;
    setColor: (s:number) => void;
    setTurns :(s:number) => void;
    setBoard: (s:any) => void;
    setHistory:(s:any) => void;
     
}
