import { Piece } from "./PiecesClass";

export interface IGameInfo {
  gameID: string;
  nickName: string;
  isLocked: boolean;
}

export interface IPosition {
  x: number,
  y: number,
}

export interface IMoveData{
  fromPosition: IPosition,
  toPosition: IPosition,
}  

export interface IHistoryTurn{
  _fromPosition: string,
  _toPosition: string,
  _pieceToMove: string,
  _pieceToKill: string|null,
  _turn: string,
  _pieceToResorect: string,
}

export enum EColor {
  BLACK,
  WHITE,
}

export enum EPiece {
  PAWN = "PAWN",
  ROOK = "ROOK",
  KNIGHT = "KNIGHT",
  BISHOP = "BISHOP",
  QUEEN = "QUEEN",
  KING = "KING",
}

export enum ON {
  CONNECTION = 'connection',
  GAMEREQUEST = 'game-request',
  GAMEENTER = 'game-enter',
  REQUESTWAITINGLIST = 'request-waitingList',
  EXIT = 'exit',
  DISCONNECT = "disconnect",
  MOVE = "move",
  PIECETOREBORN = 'piece-to-reborn',
}

export enum EMIT {
  ERROR = "error",
  NEWWAITINGLIST = "new-waitingList",
  GAMEMACHED = "game-mached",
  PLAYERLEAVE = "player-leave",
  PIECEREQUEST = "piece-request",
  UPDATEDDATA = "updated-data",

}

export type TGrid = (Piece|null)[][]
