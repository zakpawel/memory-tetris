

export function nextGameAsync() {
  return (dispatch, getState) => {
    if (getState().games[getState().currentGame].stage === 'FINISHED'
  || getState().games[getState().currentGame].stage === 'BEGIN') {
      dispatch(nextGame());
      const gameId = getState().currentGame;
      const rememberInterval = setInterval(() => {
        if (getState().currentGame === gameId &&
        getState().games[gameId].stage === 'REMEMBER_TIME_LAPSE') {
          if (getState().games[gameId].rememberTimeLeft > 1) {
            dispatch(rememberTimeTick());
          } else {
            clearInterval(rememberInterval);
            dispatch(rememberTimeTick());
            dispatch(rememberTimeFinished(gameId));
            const recallInterval = setInterval(() => {
              if (getState().currentGame === gameId &&
              getState().games[gameId].stage === 'RECALL_TIME_LAPSE') {
                if (getState().games[gameId].recallTimeLeft > 1) {
                  dispatch(recallTimeTick());
                } else {
                  clearInterval(recallInterval);
                  dispatch(recallTimeTick());
                  dispatch(recallTimeFinished(gameId));
                }
              } else {
                clearInterval(recallInterval);
              }
            }, 1000);
          }
        } else {
          clearInterval(rememberInterval);
        }
      }, 1000);
    } else {
      dispatch(recallTimeFinished(getState().currentGame));
    }
  }
}

export function selectLevel(level) {
  return {
    payload: level,
    type: 'SELECT_LEVEL'
  };
}

export function rememberTimeTick() {
  return {
    type: 'REMEMBER_TIME_TICK'
  };
}

export function recallTimeTick() {
  return {
    type: 'RECALL_TIME_TICK'
  };
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
