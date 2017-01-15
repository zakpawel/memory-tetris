import React from 'react';
import styled from 'styled-components';
import DraggableShape from '../components/DraggableShape';
import { rotateShape, randomShape, randomGrid } from '../utils';
import shapePrototypes from '../shapes';

export default class NavBar extends React.Component {

  onNextGame() {
    this.props.onNextGame();
  }

  render() {
    return (
      <Container>
        <slider>

        </slider>
        <Button
          onClick={e => this.onNextGame()}
        >
          <Anchor>Next</Anchor>
        </Button>
        <Button
          onClick={e => this.onNextGame}
        >
          <Anchor>Retry</Anchor>
        </Button>
        <Button
          onClick={e => this.onNextGame}
        >
          <Anchor>Some pretty picture here</Anchor>
        </Button>
      </Container>
    );
  }
}

const Anchor = styled.a`
  display: block;
`;

const Button = styled.div`
  background-color: lightblue;
  flex: 1 1 0;
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  @media (orientation: landscape) {
    flex-direction: column;
  }
  @media (orientation: portrait) {
    flex-direction: row;
  }
`;
