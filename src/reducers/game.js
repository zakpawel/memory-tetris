import shapes from '../shapes';
import {
  rotateShape,
  randomShape,
  randomGrid,
  emptyGrid,
  orderedGrid,
  checkShapes,
} from '../utils';

function shapePrototypes(level) {
  return shapes.slice(0, level);
}

const rememberTime = 2;
const recallTime = 20;
const gridSize = 8;
const entryLevel = 1;
const availableLevels = [1,2,3,4];
const initialShapes = shapePrototypes(entryLevel);

const initialState = {
  availableLevels,
  level: entryLevel,
  currentGame: 0,
  scale: gridSize,
  games: {
    0: {
      correctShapes: initialShapes,
      shapes: initialShapes,
      rememberTimeLeft: rememberTime,
      recallTimeLeft: recallTime,
      stage: 'BEGIN'
    }
  }
};

export function game(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_LEVEL': {
      return {
        ...state,
        level: action.payload
      };
    }
    case 'REMEMBER_TIME_TICK': {
      let timeLeft = state.games[state.currentGame].rememberTimeLeft - 1;
      timeLeft = timeLeft < 0 ? 0 : timeLeft;
      return {
        ...state,
        games: {
          ...state.games,
          [state.currentGame]: {
            ...state.games[state.currentGame],
            rememberTimeLeft: timeLeft
          }
        }
      }
    }

    case 'RECALL_TIME_TICK': {
      let timeLeft = state.games[state.currentGame].recallTimeLeft - 1;
      timeLeft = timeLeft < 0 ? 0 : timeLeft;
      return {
        ...state,
        games: {
          ...state.games,
          [state.currentGame]: {
            ...state.games[state.currentGame],
            recallTimeLeft: timeLeft
          }
        }
      }
    }

    case 'NEXT_GAME': {
      const { scale, currentGame, level } = state;
      const shapes = randomGrid(shapePrototypes(level), scale, scale);
      const nextGame = currentGame + 1;
      return {
        ...state,
        currentGame: nextGame,
        games: {
          ...state.games,
          [nextGame]: {
            ...state.games[nextGame],
            rememberTimeLeft: rememberTime,
            recallTimeLeft: recallTime,
            correctShapes: shapes,
            shapes,
            stage: 'REMEMBER_TIME_LAPSE'
          }
        }
      };
    }

    case 'REMEMBER_TIME_FINISHED': {
      const gameId = action.payload;
      const { scale, level } = state;
      const shapes = orderedGrid(shapePrototypes(level), scale, scale);
      return {
        ...state,
        games: {
          ...state.games,
          [gameId]: {
            ...state.games[gameId],
            shapes,
            stage: 'RECALL_TIME_LAPSE'
          }
        }
      };
    }

    case 'RECALL_TIME_FINISHED': {
      const gameId = action.payload;
      const game = state.games[gameId];
      const wrongShapes = checkShapes(game.shapes, game.correctShapes);

      const displayedShapes = game.correctShapes
        .map(shape =>({
          ...shape,
          correct: true
        }))
        .concat(wrongShapes.map(shape => ({ ...shape, wrong: true })))
        .reverse();
      const stage = 'FINISHED';
      return {
        ...state,
        games: {
          ...state.games,
          [gameId]: {
            ...game,
            shapes: displayedShapes,
            stage
          }
        }
      };
    }

    case 'SHAPE_MOVE': {
      const { point, index } = action.payload;
      return {
        ...state,
        games: {
          ...state.games,
          [state.currentGame]: {
            ...state.games[state.currentGame],
            shapes: Object.assign(
              [], state.games[state.currentGame].shapes,
              { [index]: {
                ...state.games[state.currentGame].shapes[index],
                location: point
              }
            })
          }
        }
      };
    }

    case 'SHAPE_ROTATE': {
      const { angle, index } = action.payload;
      return {
        ...state,
        games: {
          ...state.games,
          [state.currentGame]: {
            ...state.games[state.currentGame],
            shapes: Object.assign(
              [],
              state.games[state.currentGame].shapes,
              {
                [index]: rotateShape(state.games[state.currentGame].shapes[index], angle)
              })
          }
        }
      }
    }

    default:
      return state;
  }
}
