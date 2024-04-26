
export interface IPieceWithPositon{
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
  }

  export interface IHistoryTurn{
    _fromPosition: string,
    _toPosition: string,
    _pieceToMove: string,
    _pieceToKill: string|null,
    _turn: string,
  }

export interface IUpdatedData{
    info: IGameInfo;
    updatedBoard: IPieceWithPositon[][];
    turns: number;
    graveyard: IPiece[];
    whitePlayerId: string;
    history: IHistoryTurn[]
}

export interface IGameStore {
    inGame: boolean;
    onNewGame: boolean;
  
    startStopGame: (s: boolean) => void;
    setOnNewGame: (s: boolean) => void;
}

export interface IUpdatedDataStore{
    waitingList: IGameInfo[];
    playerColor: number|null;
    info: IGameInfo;
    updatedBoard: IPieceWithPositon[][];
    turns: number;
    graveyard: IPiece[];
    whitePlayerId: string;
    history: IHistoryTurn[];

    setWaitingList: (s:IGameInfo[]) => void;
    setPlayerColor: (s:number) => void;
    setInfo: (s:IGameInfo) => void;
    setTurns: (s:number) => void;
    setGraveyard: (s:IPiece[]) => void;
    setUpdatedBoard: (s:IPieceWithPositon[][]) => void;
    setHistory: (s:IHistoryTurn[]) => void;
}
