
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
}

export enum EColor {
  BLACK,
  WHITE,
}

export enum EPiece {
  PAWN = "PAWN",
  ROOK = "TOP",
  KNIGHT = "KON",
  BISHOP = "BISHOP",
  QUEEN = "QUEEN",
  KING = "KING",
}


