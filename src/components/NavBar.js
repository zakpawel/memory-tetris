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
        {
          React.Children.map(this.props.children, (child) => {
            return (
              <ChildContainer>
                {child}
              </ChildContainer>
            )
          })
        }
      </Container>
    );
  }
}

const ChildContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  font-size: 2rem;
  text-shadow: 0px 0px 4px black;
  font-family: arial black;
  color: white;

  @media (orientation: landscape) {
    margin: 0 1rem;
  }

  @media (orientation: portrait) {
    margin: 1rem 0;
  }
`;

const Container = styled.div`
  display: flex;
  @media (orientation: landscape) {
    flex-direction: column;
    height: 100%;
  }
  @media (orientation: portrait) {
    flex-direction: row;
  }
`;
