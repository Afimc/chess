import { ChessBoard } from "./board";
import { posiblePositionsByDirection } from "./inGame_functions";
import { EColor, EPiece, IPosition, } from "./types";

export class Piece {
    constructor(private _type: EPiece, private _color: EColor) {}

    public get type(): EPiece {
      return this._type;
    }

    public get color(): EColor {
      return this._color;
    }

    posiblePositions(fromPosition:IPosition, board:ChessBoard):IPosition[]{
      return []
    }
  }
  
  export class PAWN extends Piece{
      constructor(color: EColor){
          super(EPiece.PAWN, color)
      }

      posiblePositions(fromPosition: IPosition, board: ChessBoard) {
        const {x,y} = fromPosition;
        const posiblePositions:IPosition[]= [];
        const j = this.color === EColor.WHITE? {_y:y+1,_y2:y+2,pos:1} : {_y:y-1,_y2:y-2,pos:6};
        const isCurentPositionInBoard = x >= 0 && y >= 0 && x < board.grid[0].length && y < board.grid.length
        const isTestPositionInBoard = j._y >= 0 && j._y < board.grid.length  
        if(isCurentPositionInBoard && isTestPositionInBoard ){ 
            if (y === j.pos && board.grid[j._y][x]=== null && board.grid[j._y2][x] === null)posiblePositions.push({x:x, y:j._y2});
            if (board.grid[j._y][x] === null)posiblePositions.push({x:x, y:j._y});
            if (board.grid[j._y][x+1] && board.grid[j._y][x+1].color !== this.color)posiblePositions.push({x:x+1, y:j._y});
            if (board.grid[j._y][x-1] && board.grid[j._y][x-1].color !== this.color)posiblePositions.push({x:x-1, y:j._y});
        }
        return posiblePositions;
    }
  }
  
  export class ROOK extends Piece{
      constructor(color: EColor){
          super(EPiece.ROOK, color)
      }

      posiblePositions(fromPosition:IPosition, board:ChessBoard){
          const directions:IPosition[] =[
              {x:1, y:0},
              {x:-1, y:0},
              {x:0, y:1},
              {x:0, y:-1}
          ]
          const posiblePOsition:IPosition[] = posiblePositionsByDirection(fromPosition, board.grid,directions,8)
          return posiblePOsition;
      }
  }
  
  export class KNIGHT extends Piece{
      constructor(color: EColor){
          super(EPiece.KNIGHT, color)
      }

      posiblePositions(fromPosition: IPosition, board: ChessBoard) {
            const {x,y} = fromPosition
            const knightPositions:IPosition[] = [
              { x: x - 2, y: y + 1 },
              { x: x - 2, y: y - 1 },
              { x: x + 2, y: y + 1 },
              { x: x + 2, y: y - 1 },
          
              { x: x - 1, y: y + 2 },
              { x: x - 1, y: y - 2 },
              { x: x + 1, y: y + 2 },
              { x: x + 1, y: y - 2 },
            ];
            const filteredKnightPositions = knightPositions.filter( //?????????????????????????????????????????????????????????
              (pos) => (pos.x >= 0 && pos.y >= 0 && pos.x < board.grid[0].length && pos.y < board.grid.length ) //?????????????
            ).filter((avPos) => board.grid[avPos.y][avPos.x]? board.grid[avPos.y][avPos.x].color !== this.color : true) //?????
        return filteredKnightPositions;
      }
  }
  
  export class BISHOP extends Piece{
      constructor(color: EColor){
          super(EPiece.BISHOP, color)
      }

      posiblePositions(fromPosition:IPosition, board:ChessBoard){
        const directions:IPosition[] = [
            {x:+1, y:+1},
            {x:+1, y:-1},
            {x:-1, y:+1},
            {x:-1, y:-1}
        ]
        const posiblePositions:IPosition[] = posiblePositionsByDirection(fromPosition,board.grid,directions,8)
        return posiblePositions;
      }
  }
  
  export class QUEEN extends Piece{
      constructor(color: EColor){
          super(EPiece.QUEEN, color)
      }

      posiblePositions(fromPosition:IPosition, board:ChessBoard){
          const directions:IPosition[] = [
              {x:1, y:0}, {x:+1, y:+1},
              {x:-1, y:0},{x:+1, y:-1},
              {x:0, y:1}, {x:-1, y:+1},
              {x:0, y:-1}, {x:-1, y:-1},
          ]
          const posiblePositions:IPosition[]=posiblePositionsByDirection(fromPosition,board.grid,directions,8)
          return posiblePositions;
      }
  }
  
  export class KING extends Piece{
      constructor(color: EColor){
          super(EPiece.KING, color)
      }
      
      posiblePositions(fromPosition:IPosition, board:ChessBoard){
          const directions:IPosition[] =[
              {x:1, y:0}, {x:+1, y:+1},
              {x:-1, y:0},{x:+1, y:-1},
              {x:0, y:1}, {x:-1, y:+1},
              {x:0, y:-1}, {x:-1, y:-1},
          ]
          const posiblePositions:IPosition[]=posiblePositionsByDirection(fromPosition,board.grid,directions,2)
          return posiblePositions;
      }
  }
  