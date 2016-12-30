import React from 'react';
import Rect from '../components/Rect';
import Figure from '../components/Figure';
import styled from 'styled-components';

export default class RootContainer extends React.Component {
  render() {
    return (
      <Figure angle={45}>
        <Rect color='#1ecc65' />
        <Rect color='#1ecc65' />
        <Rect color='#1ecc65' />
        <Rect color='#1ecc65' />
      </Figure>
    );
  }
}
