import './style/globalStyles.css'; 
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import Root from './containers/Root';

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById("app")
)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const Root = require('./containers/Root').default;
    render(
      <AppContainer>
        <Root />
      </AppContainer>,
      document.getElementById("app")
    )
  });
}
