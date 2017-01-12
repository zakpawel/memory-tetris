

export function nextGameAsync() {
  return (dispatch, getState) => {
    dispatch(nextGame());
    const gameId = getState().currentGame;
    setTimeout(() => {
      if (getState().currentGame === gameId &&
        getState().games[gameId].stage === 'REMEMBER_TIME_LAPSE') {
        dispatch(rememberTimeFinished(gameId))
        setTimeout(() => {
          if (getState().currentGame === gameId &&
            getState().games[gameId].stage === 'RECALL_TIME_LAPSE') {
            dispatch(recallTimeFinished(gameId));
          }
        }, 20000);
      }
    }, 5000);
  }
}

export function nextGame() {
  return {
    type: 'NEXT_GAME'
  };
}

export function rememberTimeFinished(gameId) {
  return {
    payload: gameId,
    type: 'REMEMBER_TIME_FINISHED'
  };
}

export function recallTimeFinished(gameId) {
  return {
    payload: gameId,
    type: 'RECALL_TIME_FINISHED'
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
