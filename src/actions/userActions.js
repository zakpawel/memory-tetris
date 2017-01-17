import stageTypes from '../constants/gameStages';
import types from '../constants/actionTypes';

export function nextGameAsync() {
  return (dispatch, getState) => {
    const state = getState();
    const currentGame = state.games[state.currentGame];
    const stage = currentGame.stage;

    if (stage === stageTypes.FINISHED || stage === stageTypes.BEGIN) {
      dispatch(nextGame());
      const gameId = getState().currentGame;
      const rememberInterval = setInterval(() => {
        if (getState().currentGame === gameId &&
        getState().games[gameId].stage === stageTypes.REMEMBER_TIME_LAPSE) {
          if (getState().games[gameId].rememberTimeLeft > 1) {
            dispatch(rememberTimeTick());
          } else {
            clearInterval(rememberInterval);
            dispatch(rememberTimeTick());
            dispatch(rememberTimeFinished(gameId));
            const recallInterval = setInterval(() => {
              if (getState().currentGame === gameId &&
              getState().games[gameId].stage === stageTypes.RECALL_TIME_LAPSE) {
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
    type: types.SELECT_LEVEL
  };
}

export function rememberTimeTick() {
  return {
    type: types.REMEMBER_TIME_TICK
  };
}

export function recallTimeTick() {
  return {
    type: types.RECALL_TIME_TICK
  };
}

export function nextGame() {
  return {
    type: types.NEXT_GAME
  };
}

export function rememberTimeFinished(gameId) {
  return {
    payload: gameId,
    type: types.REMEMBER_TIME_FINISHED
  };
}

export function recallTimeFinished(gameId) {
  return {
    payload: gameId,
    type: types.RECALL_TIME_FINISHED
  };
}
export function shapeMove(point, index) {
  return {
    payload: {
      point,
      index
    },
    type: types.SHAPE_MOVE
  };
}

export function shapeRotate(angle, index) {
  return {
    payload: {
      angle,
      index
    },
    type: types.SHAPE_ROTATE
  };
}
