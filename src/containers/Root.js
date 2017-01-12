import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DraggableShape from '../components/DraggableShape';
import Toolbox from '../components/Toolbox';
import NavBar from '../components/NavBar';
import { rotateShape, randomShape, randomGrid } from '../utils';
import shapePrototypes from '../shapes';
import { nextGameAsync, shapeMove, shapeRotate } from '../actions/userActions';

function mapStateToProps(state) {
  return {
    ...state.games[state.currentGame],
    scale: state.scale
  };
}

const actionProps = {
  nextGame: nextGameAsync,
  shapeMove,
  shapeRotate
};

class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  onShapeMove([x,y], i) {
    console.log('onShapeMove', x,y);
    this.props.shapeMove([x,y], i);
  }

  onShapeRotate(angle, i) {
    console.log('onShapeRotate', angle);
    this.props.shapeRotate(angle, i);
  }

  onNextGame() {
    console.log('onNextGame');
    this.props.nextGame();
  }

  render() {
    console.log(this);
    return (
        <Container>
          <SvgContainer>
            <Svg
              viewBox={`0 0 ${this.props.scale} ${this.props.scale}`}
              preserveAspectRatio="xMinYMin meet">
              <defs>
                <pattern
                  id="grid"
                  width="1"
                  height="1"
                  patternUnits="userSpaceOnUse"
                >
                  <path d={`M 0 0 L 0 0 0 1`}
                    fill="none" stroke="gray" strokeWidth="0.01"/>
                  <path d={`M 0 0 L 0 0 1 0`}
                    fill="none" stroke="gray" strokeWidth="0.01"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              { this.props.shapes.map((shape, i) => {
                return (
                  <DraggableShape
                    { ...shape }
                    key={i}
                    scale={this.props.scale}
                    onMove={e => this.onShapeMove(e, i)}
                    onRotate={e => this.onShapeRotate(e, i)}
                  />
                );
              }) }
            </Svg>
          </SvgContainer>
          <ToolboxContainer>
            <NavBar onNextGame={() => this.onNextGame()} />
          </ToolboxContainer>
        </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  @media (orientation: portrait) {
    flex-direction: column;
  }
  z-index: 1000;
  touch-action: none;
`;

const SvgContainer = styled.div`
  @media (orientation: landscape) {
    max-width: 100vh;
    max-height: 100vh;
    flex: 1 1 0;
  }
`;

const Svg = styled.svg`

`;

const ToolboxContainer = styled.div`
  @media (orientation: landscape) {
    background-color: lightgreen;
  }
  @media (orientation: portrait) {
    background-color: red;
  }
`;

export default connect(mapStateToProps, actionProps)(Root)
