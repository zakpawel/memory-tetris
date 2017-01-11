import './style/globalStyles.css';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import Root from './containers/Root';
import { game } from './reducers/game';

// const store = createStore(game);
const store = createStore(game, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

render(
  <AppContainer>
    <Provider store={store}>
      <Root />
    </Provider>
  </AppContainer>,
  document.getElementById("app")
)

if (module.hot) {
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
