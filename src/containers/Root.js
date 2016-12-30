import React from 'react';
import Grid from '../components/Grid';
import Rect from '../components/Rect';
import Shape from '../components/Shape';
import styled from 'styled-components';

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <Grid size={20} />
        <Shape angle={45}>
          <Rect color='#1ecc65' />
          <Rect color='#1ecc65' />
          <Rect color='#1ecc65' />
          <Rect color='#1ecc65' />
        </Shape>
      </div>
    );
  }
}
