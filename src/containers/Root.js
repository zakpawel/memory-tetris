import React from 'react';
import Grid from '../components/Grid';
import Rect from '../components/Rect';
import Shape from '../components/Shape';
import styled from 'styled-components';


const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  touch-action: none;
`;

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <Grid n={20} m={20} points={[]} />
        <Container>
          <Shape points={[[0,0], [0,1], [0,2], [1,1]]} />
        </Container>
      </div>
    );
  }
}
