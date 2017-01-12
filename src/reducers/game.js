import shapePrototypes from '../shapes';
import { rotateShape, randomShape, randomGrid, emptyGrid, orderedGrid } from '../utils';

const initialState = {
  currentGame: 0,
  scale: 12,
  games: {
    0: {
      shapes: shapePrototypes,
      grid: emptyGrid(12,12),
      rememberTimeLeft: 5000,
      recallTimeLeft: 20000,
      stage: 'BEGIN'
    }
  }
};

export function game(state = initialState, action) {
  switch (action.type) {
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
      return {
        ...state,
        games: {
          ...state.games,
          [gameId]: {
            ...state.games[gameId],
            stage: 'BEGIN'
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
