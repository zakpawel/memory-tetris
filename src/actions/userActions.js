export function nextGame() {
  return {
    type: 'NEXT_GAME'
  };
}

export function shapeMove(point, index) {
  return {
    payload: {
      point,
      index
    },
    type: 'SHAPE_MOVE'
  };
}

export function shapeRotate(angle, index) {
  return {
    payload: {
      angle,
      index
    },
    type: 'SHAPE_ROTATE'
  };
}
