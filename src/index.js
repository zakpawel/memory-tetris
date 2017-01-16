import './style/globalStyles.css';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import Root from './containers/Root';
import { game } from './reducers/game';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const store = createStore(
  game,
  !IS_PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION__ ?
    compose(
      applyMiddleware(thunkMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__()
    ) :
    applyMiddleware(thunkMiddleware)
);

render(
  <AppContainer>
    <Provider store={store}>
      <Root />
    </Provider>
  </AppContainer>,
  document.getElementById("app")
)

if (!IS_PRODUCTION && module.hot) {
  module.hot.accept('./containers/Root', () => {
    const Root = require('./containers/Root').default;
    render(
      <AppContainer>
        <Provider store={store}>
          <Root />
        </Provider>
      </AppContainer>,
      document.getElementById("app")
    )
  });
}
