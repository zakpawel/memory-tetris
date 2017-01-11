import shapePrototypes from '../shapes';
import { rotateShape, randomShape, randomGrid, emptyGrid } from '../utils';

// const [grid, shapes] = randomGrid(shapePrototypes, 12, 12);
const initialState = {
  shapes: shapePrototypes,
  grid: emptyGrid(12,12),
  scale: 12,
  stage: 'remember'
};

export function game(state = initialState, action) {
  switch (action.type) {
    case 'NEXT_GAME': {
      const { scale } = state;
      const [grid, shapes] = randomGrid(shapePrototypes, scale, scale);
      return {
        ...state,
        shapes,
        grid
      };
    }
    case 'SHAPE_MOVE': {
      const { point, index } = action.payload;
      return {
        ...state,
        shapes: Object.assign(
          [], state.shapes,
          { [index]: {
            ...state.shapes[index],
            location: point
            }
        })
      };
    }
    case 'SHAPE_ROTATE': {
      const { angle, index } = action.payload;
      return {
        ...state,
        shapes: Object.assign(
          [],
          state.shapes,
          {
            [index]: rotateShape(state.shapes[index], angle)
          })
      }
    }
    default:
      return state;
  }
}
