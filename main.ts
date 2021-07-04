import { depthFirstSearchDecisionTree } from "./algorithm/depth-first-search-decision-tree.ts";

const everyPosition: PositionOnBoard[] = [
  { bottom: 1, left: 0, right: 0 },

  { bottom: 0.75, left: 0, right: 0.25 },
  { bottom: 0.75, left: 0.25, right: 0 },

  { bottom: 0.5, left: 0, right: 0.5 },
  { bottom: 0.5, left: 0.25, right: 0.25 },
  { bottom: 0.5, left: 0.5, right: 0 },

  { bottom: 0.25, left: 0, right: 0.75 },
  { bottom: 0.25, left: 0.25, right: 0.5 },
  { bottom: 0.25, left: 0.5, right: 0.25 },
  { bottom: 0.25, left: 0.75, right: 0 },

  { bottom: 0, left: 0, right: 1 },
  { bottom: 0, left: 0.25, right: 0.75 },
  { bottom: 0, left: 0.5, right: 0.5 },
  { bottom: 0, left: 0.75, right: 0.25 },
  { bottom: 0, left: 1, right: 0 },
];

const getLeft = (position: PositionOnBoard): PositionOnBoard | void => {
  const result = {
    bottom: position.bottom,
    left: position.left - 0.25,
    right: position.right + 0.25,
  };
  if (isPositionOnBoard(result)) return result;
};

const getRight = (position: PositionOnBoard): PositionOnBoard | void => {
  const result = {
    bottom: position.bottom,
    left: position.left + 0.25,
    right: position.right - 0.25,
  };
  if (isPositionOnBoard(result)) return result;
};

const getUpperLeft = (position: PositionOnBoard): PositionOnBoard | void => {
  const result = {
    bottom: position.bottom + 0.25,
    left: position.left - 0.25,
    right: position.right,
  };
  if (isPositionOnBoard(result)) return result;
};

const getUpperRight = (position: PositionOnBoard): PositionOnBoard | void => {
  const result = {
    bottom: position.bottom + 0.25,
    left: position.left,
    right: position.right - 0.25,
  };
  if (isPositionOnBoard(result)) return result;
};

const getBottomLeft = (position: PositionOnBoard): PositionOnBoard | void => {
  const result = {
    bottom: position.bottom - 0.25,
    left: position.left,
    right: position.right + 0.25,
  };
  if (isPositionOnBoard(result)) return result;
};

const getBottomRight = (position: PositionOnBoard): PositionOnBoard | void => {
  const result = {
    bottom: position.bottom - 0.25,
    left: position.left + 0.25,
    right: position.right,
  };
  if (isPositionOnBoard(result)) return result;
};

const isPositionOnBoard = (data: {
  bottom: number;
  left: number;
  right: number;
}): data is PositionOnBoard =>
  everyPosition.some((position) => arePositionsTheSame(position, data));

interface PositionOnBoard {
  left: 0 | 0.25 | 0.5 | 0.75 | 1;
  right: 0 | 0.25 | 0.5 | 0.75 | 1;
  bottom: 0 | 0.25 | 0.5 | 0.75 | 1;
}

interface Board {
  pieces: PositionOnBoard[];
}

interface Decision {
  start: PositionOnBoard;
  end: PositionOnBoard;
}

const startingBoard: Board = {
  pieces: [
    { bottom: 1, left: 0, right: 0 },
    { bottom: 0.75, left: 0, right: 0.25 },
    { bottom: 0.75, left: 0.25, right: 0 },
    { bottom: 0.5, left: 0, right: 0.5 },
    { bottom: 0.5, left: 0.25, right: 0.25 },
    { bottom: 0.5, left: 0.5, right: 0 },
    { bottom: 0.25, left: 0, right: 0.75 },
    { bottom: 0.25, left: 0.25, right: 0.5 },
    { bottom: 0.25, left: 0.5, right: 0.25 },
    { bottom: 0.25, left: 0.75, right: 0 },
    { bottom: 0, left: 0, right: 1 },
    { bottom: 0, left: 0.25, right: 0.75 },
    { bottom: 0, left: 0.5, right: 0.5 },
    { bottom: 0, left: 0.75, right: 0.25 },
  ],
};

const arePositionsTheSame = (
  a: { bottom: number; left: number; right: number },
  b: { bottom: number; left: number; right: number }
): boolean => a.bottom === b.bottom && a.left === b.left && a.right === b.right;

const getPositionInBetween = (
  a: PositionOnBoard,
  b: PositionOnBoard
): PositionOnBoard => {
  const averagePoint = {
    bottom: (a.bottom + b.bottom) / 2,
    left: (a.left + b.left) / 2,
    right: (a.right + b.right) / 2,
  };
  if (isPositionOnBoard(averagePoint)) return averagePoint;
  throw new Error(
    `${JSON.stringify(averagePoint)} is not a point on the board!`
  );
};

const getCurrentBoard = (
  startingBoard: Board,
  decisions: Decision[]
): Board => {
  return {
    pieces: decisions.reduce((pieces, decision): PositionOnBoard[] => {
      const middlePiece = getPositionInBetween(decision.start, decision.end);
      return [
        ...pieces.filter((piece) => {
          if (arePositionsTheSame(middlePiece, piece)) return false;
          if (arePositionsTheSame(decision.start, piece)) return false;
          return true;
        }),
        decision.end,
      ];
    }, startingBoard.pieces),
  };
};

const getNextLegalDecisions = (decisions: Decision[]): Decision[] => {
  const currentBoard = getCurrentBoard(startingBoard, decisions);
  const nextDecisions: Decision[] = [];
  currentBoard.pieces.forEach((piece) => {
    const getDirections = [
      getLeft,
      getRight,
      getUpperLeft,
      getUpperRight,
      getBottomLeft,
      getBottomRight,
    ];
    getDirections.forEach((getDirection) => {
      const middle = getDirection(piece);
      if (middle) {
        const isMiddleAPieceOnBoard = currentBoard.pieces.some((piece) =>
          arePositionsTheSame(piece, middle)
        );
        if (isMiddleAPieceOnBoard) {
          const end = getDirection(middle);
          if (end) {
            const isEndAPieceOnBoard = currentBoard.pieces.some((piece) =>
              arePositionsTheSame(piece, end)
            );
            if (!isEndAPieceOnBoard) {
              const decision: Decision = { start: piece, end };
              nextDecisions.push(decision);
            }
          }
        }
      }
    });
  });
  return nextDecisions;
};

const isBranchFinished = (decisions: Decision[]): boolean =>
  getNextLegalDecisions(decisions).length === 0;

const generator = depthFirstSearchDecisionTree<Decision>({
  getNextLegalDecisions,
  isBranchFinished,
});

const scoreBoard = (
  startingBoard: Board,
  decisions: Decision[]
): 0 | 10 | 25 | 50 | 100 | 200 => {
  const currentBoard = getCurrentBoard(startingBoard, decisions);
  if (currentBoard.pieces.length === 3) return 10;
  if (currentBoard.pieces.length === 2) return 25;
  if (currentBoard.pieces.length === 1) {
    const startingEmptyPosition = everyPosition.find((oneOfEveryPosition) =>
      startingBoard.pieces.every((filledPosition) => {
        return !arePositionsTheSame(oneOfEveryPosition, filledPosition);
      })
    );
    if (
      startingEmptyPosition &&
      arePositionsTheSame(startingEmptyPosition, currentBoard.pieces[0])
    ) {
      return 100;
    }
    return 50;
  }
  if (currentBoard.pieces.length === 8) return 200;
  return 0;
};

interface Solution {
  decisions: Decision[];
  score: number;
}
const solutions: Solution[] = [];
while (true) {
  const result = generator.next();
  if (!result.value) {
    break;
  }
  const score = scoreBoard(startingBoard, result.value);
  solutions.push({
    decisions: result.value,
    score,
  });
  // if (solutions.every((solution) => solution.score < score)) {
  //   console.log(score, result.value);
  // }
  if (result.done) {
    break;
  }
}

solutions.sort((a, b) => {
  return b.score - a.score;
});
console.log(JSON.stringify(solutions[0]));
