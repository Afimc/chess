
export interface IRow{
    piece: IPiece,
    posiblePositions: Iposition[]
}
export interface Iposition {
    x: number,
    y: number,
  }


export interface IPiece{
    _color: number,
    _type: '',
}

export interface IGameInfo {
    gameID: string
    nickName: string;
    isLocked: boolean;
    id: string;
  }

  export interface IHistoryTurn{
    _fromPosition: string,
    _toPosition: string,
    _pieceToMove: string,
    _pieceToKill: string,
    _turn: string,
  }

export interface IUpdatedData{
    info:IGameInfo;
    updatedBoard:IRow[][];
    turns:number;
    graveyard:IPiece[];
    whitePlayerId:string;
    history:IHistoryTurn[]
}

export interface IGameStore {
    inGame: boolean;
    onNewGame: boolean;
  
    startStopGame: (s: boolean) => void;
    setOnNewGame: (s: boolean) => void;
}

export interface IUpdatedDataStore{
    waitingList: IGameInfo[];
    playerColor:number|null;
    info:IGameInfo;
    updatedBoard:IRow[][];
    turns:number;
    graveyard:IPiece[];
    whitePlayerId:string;
    history:IHistoryTurn[]

    setInfo: (s:IGameInfo) => void;
    setWaitingList: (s:IGameInfo[]) => void;
    setPlayerColor: (s:number) => void;
    setTurns: (s:number) => void;
    setUpdatedBoard: (s:IRow[][]) => void;
    setHistory: (s:IHistoryTurn[]) => void;
     
}
