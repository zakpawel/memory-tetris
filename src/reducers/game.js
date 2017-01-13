import shapePrototypes from '../shapes';
import {
  rotateShape,
  randomShape,
  randomGrid,
  emptyGrid,
  orderedGrid,
  checkGrid,
} from '../utils';

const rememberTime = 2000;
const recallTime = 20000;
const gridSize = 12;

const initialState = {
  currentGame: 0,
  scale: gridSize,
  games: {
    0: {
      shapes: shapePrototypes,
      grid: emptyGrid(gridSize,gridSize),
      rememberTimeLeft: rememberTime,
      recallTimeLeft: recallTime,
      stage: 'BEGIN'
    }
  }
};

export function game(state = initialState, action) {
  switch (action.type) {
    case 'REMEMBER_TIME_TICK': {
      let timeLeft = state.games[state.currentGame].rememberTimeLeft - 1000;
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
      let timeLeft = state.games[state.currentGame].recallTimeLeft - 1000;
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
      const { scale, currentGame } = state;
      const [grid, shapes] = randomGrid(shapePrototypes, scale, scale);
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
            shapes,
            grid,
            stage: 'REMEMBER_TIME_LAPSE'
          }
        }
      };
    }

    case 'REMEMBER_TIME_FINISHED': {
      const gameId = action.payload;
      const { scale } = state;
      const [grid, shapes] = orderedGrid(shapePrototypes, scale, scale);
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
      console.log(game)
      const gameResult = checkGrid(game.shapes, game.grid);
      const stage = gameResult ? 'END_OK' : 'END_FAIL';
      return {
        ...state,
        games: {
          ...state.games,
          [gameId]: {
            ...state.games[gameId],
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
