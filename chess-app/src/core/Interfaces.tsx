export interface IPieceWithPositon {
  piece: IPiece;
  posiblePositions: Iposition[];
}

export interface Iposition {
  x: number;
  y: number;
}

export interface IPiece {
  _color: number;
  _type: '';
}

export interface IGameInfo {
  gameID: string;
  gameName: string;
  isLocked: boolean;
}

export interface IHistoryTurn {
  _fromPosition: string;
  _toPosition: string;
  _pieceToMove: string;
  _pieceToKill: string | null;
  _turn: string;
  _pieceToResorect: string | null;
}

export interface IUpdatedData {
  info: IGameInfo;
  updatedBoard: IPieceWithPositon[][];
  turns: number;
  graveyard: IPiece[];
  whitePlayerId: string;
  history: IHistoryTurn[];
}

export enum ON {
  ERROR = "error",
  MATT = 'matt',
  NEWWAITINGLIST = "new-waitingList",
  GAMEMACHED = "game-mached",
  PLAYERLEAVE = "player-leave",
  PIECEREQUEST = "piece-request",
  UPDATEDDATA = "updated-data",
}

export enum EMIT {
  CONNECTION = 'connection',
  REQUESTWAITINGLIST = 'request-waitingList',
  GAMEREQUEST = 'game-request',
  GAMEENTER = 'game-enter',
  EXIT = 'exit',
  DISCONNECT = "disconnect",
  MOVE = "move",
  PIECETOREBORN = 'piece-to-reborn',
}

export interface IGameStore {
  inGame: boolean;
  onNewGame: boolean;
  onRebornRequest: boolean;

  startStopGame: (s: boolean) => void;
  setOnNewGame: (s: boolean) => void;
  setOnRebornRequest: (s: boolean) => void;
}

export interface IUpdatedDataStore {
  waitingList: IGameInfo[];
  playerColor: number | null;
  info: IGameInfo;
  updatedBoard: IPieceWithPositon[][];
  turns: number;
  graveyard: IPiece[];
  whitePlayerId: string;
  history: IHistoryTurn[];
  numberOfGames: number;
  isMatt: boolean;

  setWaitingList: (s: IGameInfo[]) => void;
  setPlayerColor: (s: number) => void;
  setInfo: (s: IGameInfo) => void;
  setTurns: (s: number) => void;
  setGraveyard: (s: IPiece[]) => void;
  setUpdatedBoard: (s: IPieceWithPositon[][]) => void;
  setHistory: (s: IHistoryTurn[]) => void;
  setNumberOfGames: (s: number) => void;
  setIsMatt: (s: boolean) => void;
}
