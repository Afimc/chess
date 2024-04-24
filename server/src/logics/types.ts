

export interface Iposition {
    x: number,
    y: number,
  }

export interface IHistoryTurn{
  _fromPosition: string,
  _toPosition: string,
  _pieceToMove: string,
  _pieceToKill: string,
  _turn: string,
}

export interface IGameInfo {
    gameID: string;
    nickName: string;
    isLocked: boolean;
    id: string;
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
  

