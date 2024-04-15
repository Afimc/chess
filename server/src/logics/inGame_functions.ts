export enum EPiece {
  PAWN = "PAWN",
  ROOK = "TOP",
  KNIGHT = "KON",
  BISHOP = "BISHOP",
  QUEEN = "QUEEN",
  KING = "KING",
}

export function positionConvertToVector(position: string) {
  const [_x, _y] = position.split("");
  const y = parseInt(_y);
  const arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  let x = arr.indexOf(_x);
  const res = { x: x, y: y };
  return res;
}

export function positionConvertToString(vector: { x: number; y: number }) {
  const y = vector.y;
  const arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const x = arr[vector.x];
  const position = x + y;
  return position;
}

export function availablePositions(
  pos: { x: number; y: number },
  type: EPiece
) {
  const { x, y } = pos;
  if (type === EPiece.ROOK) {
    return rookPositions(x, y);
  } else if (type === EPiece.KNIGHT) {
    return knightPositions(x, y);
  } else if (type === EPiece.BISHOP) {
    return bishopPositions(x, y);
  }
}

export function rookPositions(x:number, y:number) {
  const rookPositions = [
    { x: x + 1, y: y },
    { x: x, y: y + 1 },
    { x: x + 2, y: y },
    { x: x, y: y + 2 },
    { x: x + 3, y: y },
    { x: x, y: y + 3 },
    { x: x + 4, y: y },
    { x: x, y: y + 4 },
    { x: x + 5, y: y },
    { x: x, y: y + 5 },
    { x: x + 6, y: y },
    { x: x, y: y + 6 },
    { x: x + 7, y: y },
    { x: x, y: y + 7 },
    { x: x - 7, y: y },
    { x: x, y: y - 7 },
    { x: x - 6, y: y },
    { x: x, y: y - 6 },
    { x: x - 5, y: y },
    { x: x, y: y - 5 },
    { x: x - 4, y: y },
    { x: x, y: y - 4 },
    { x: x - 3, y: y },
    { x: x, y: y - 3 },
    { x: x - 2, y: y },
    { x: x, y: y - 2 },
    { x: x - 1, y: y },
    { x: x, y: y - 1 },
  ];
  const filteredRookPositions = rookPositions.filter(
    (pos) => pos.x >= 0 && pos.y >= 0 && pos.x < 8 && pos.y < 8
  );
  return filteredRookPositions;
}

export function knightPositions(x:number, y:number) {
  const knightPositions = [
    { x: x - 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x + 2, y: y + 1 },
    { x: x + 2, y: y - 1 },

    { x: x - 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x + 1, y: y + 2 },
    { x: x + 1, y: y - 2 },
  ];
  const filteredKnightPositions = knightPositions.filter(
    (pos) => pos.x >= 0 && pos.y >= 0 && pos.x < 8 && pos.y < 8
  );
  return filteredKnightPositions;
}

export function bishopPositions(x:number, y:number) {
  const bishopPositions = [
    { x: x + 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 2, y: y + 2 },
    { x: x + 2, y: y - 2 },
    { x: x + 3, y: y + 3 },
    { x: x + 3, y: y - 3 },
    { x: x + 4, y: y + 4 },
    { x: x + 4, y: y - 4 },
    { x: x + 5, y: y + 5 },
    { x: x + 5, y: y - 5 },
    { x: x + 6, y: y + 6 },
    { x: x + 6, y: y - 6 },
    { x: x + 7, y: y + 7 },
    { x: x + 7, y: y - 7 },

    { x: x - 1, y: y + 1 },
    { x: x - 1, y: y - 1 },
    { x: x - 2, y: y + 2 },
    { x: x - 2, y: y - 2 },
    { x: x - 3, y: y + 3 },
    { x: x - 3, y: y - 3 },
    { x: x - 4, y: y + 4 },
    { x: x - 4, y: y - 4 },
    { x: x - 5, y: y + 5 },
    { x: x - 5, y: y - 5 },
    { x: x - 6, y: y + 6 },
    { x: x - 6, y: y - 6 },
    { x: x - 7, y: y + 7 },
    { x: x - 7, y: y - 7 },
  ];
  const filteredBishopPositions = bishopPositions.filter(
    (pos) => pos.x >= 0 && pos.y >= 0 && pos.x < 8 && pos.y < 8
  );
  return filteredBishopPositions;
}
