

export interface Iposition {
    x: number,
    y: number,
  }

export interface IGameInfo {
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
  

