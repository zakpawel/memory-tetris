import stageTypes from '../constants/gameStages';
import types from '../constants/actionTypes';
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
      stage: stageTypes.BEGIN
    }
  }
};

export function game(state = initialState, action) {
  switch (action.type) {
    case types.SELECT_LEVEL: {
      return {
        ...state,
        level: action.payload
      };
    }
    case types.REMEMBER_TIME_TICK: {
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

    case types.RECALL_TIME_TICK: {
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

    case types.NEXT_GAME: {
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
            stage: stageTypes.REMEMBER_TIME_LAPSE
          }
        }
      };
    }

    case types.REMEMBER_TIME_FINISHED: {
      const gameId = action.payload;
      const { scale } = state;
      const shapes = orderedGrid(state.games[gameId].shapes, scale, scale);
      return {
        ...state,
        games: {
          ...state.games,
          [gameId]: {
            ...state.games[gameId],
            shapes,
            stage: stageTypes.RECALL_TIME_LAPSE
          }
        }
      };
    }

    case types.RECALL_TIME_FINISHED: {
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
      const stage = stageTypes.FINISHED;
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

    case types.SHAPE_MOVE: {
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

    case types.SHAPE_ROTATE: {
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
