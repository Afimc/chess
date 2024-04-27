import { Piece } from "./Pieces";
import { IPosition } from "./types";

export function positionConvertToVector(position: string) {
  const [_x, _y] = position.split("");
  const y = parseInt(_y);
  const arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  let x = arr.indexOf(_x);
  const res = { x: x, y: y };
  return res;
}

export function positionConvertToString(vector: IPosition) {
  const y = vector.y+1;
  const arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const x = arr[vector.x];
  const position = x + y;
  return position;
}

export function posiblePositionsByDirection(fromPosition:IPosition, boardGrid:(null|Piece)[][], directions:IPosition[], range:number){
  const posiblePOsition:IPosition[]=[]
  const myColor = boardGrid[fromPosition.y][fromPosition.x].color

  directions.forEach((d)=>{
      for (let j = 0; j < range; j++) {
          const x = fromPosition.x + d.x*j;
          const y = fromPosition.y + d.y*j;
          const pos = {x,y};
          const conditions = pos.x >= 0 && pos.x < boardGrid[0].length && pos.y >=0 && pos.y < boardGrid.length;
          if(fromPosition.x === x && fromPosition.y === y)continue
          let stopOnNext =false
          if (!conditions) return
          if (boardGrid[pos.y][pos.x] !== null) {
            if(boardGrid[pos.y][pos.x].color !== myColor) {
              stopOnNext = true
            } else {return}
          };
          posiblePOsition.push(pos);
          if (stopOnNext) return
      }
  })
  return posiblePOsition
}


function isCheck(){
  
}