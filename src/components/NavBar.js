import React from 'react';
import styled from 'styled-components';
import DraggableShape from '../components/DraggableShape';
import { rotateShape, randomShape, randomGrid } from '../utils';

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
  font-family: sans-serif;
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
  height: 100%;
  width: 100%;
  @media (orientation: landscape) {
    flex-direction: column;
  }
  @media (orientation: portrait) {
    flex-direction: row;
  }
`;
