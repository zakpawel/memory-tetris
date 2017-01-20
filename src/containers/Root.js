import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DraggableShape from '../components/DraggableShape';
import NavBar from '../components/NavBar';
import Info from '../components/Info';
import Levels from '../components/Levels';
import Counter from '../components/Counter';
import Button from '../components/Button';
import { rotateShape, randomShape, randomGrid } from '../utils';
import { selectLevel, nextGameAsync, shapeMove, shapeRotate } from '../actions/userActions';
import colors from '../style/colorPalette';

function mapStateToProps(state) {

  const {
    availableLevels,
    level,
    scale
  } = state;

  return {
    ...state.games[state.currentGame],
    availableLevels,
    level,
    scale
  };
}

const actionProps = {
  nextGame: nextGameAsync,
  shapeMove,
  shapeRotate,
  selectLevel
};

class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  onShapeMove([x,y], i) {
    if (this.props.stage !== 'RECALL_TIME_LAPSE') return;
    this.props.shapeMove([x,y], i);
  }

  onShapeRotate(angle, i) {
    if (this.props.stage !== 'RECALL_TIME_LAPSE') return;
    this.props.shapeRotate(angle, i);
  }

  onNextGame() {
    this.props.nextGame();
  }

  onSelectLevel(level) {
    this.props.selectLevel(level);
  }

  render() {
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
                    canMove={this.props.stage === 'RECALL_TIME_LAPSE'}
                  />
                );
              }) }
            </Svg>
          </SvgContainer>
          <ToolboxContainer>
            <NavBar>
              <Counter>
                <div>
                  {
                    (this.props.stage === 'BEGIN' ||
                    this.props.stage === 'REMEMBER_TIME_LAPSE') ?
                    this.props.rememberTimeLeft :
                    this.props.recallTimeLeft
                  }
                </div>
              </Counter>

              <Button
                onClick={e => this.onNextGame()}
              >
                Next
              </Button>
              <Levels
                current={this.props.level}
                available={this.props.availableLevels}
                onSelect={level => this.onSelectLevel(level)}
              />
            </NavBar>
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
  @media (orientation: portrait) {
    width: calc(100vh - 9rem);
    max-width: 100vw;
  }

`;

const Svg = styled.svg`

`;

const ToolboxContainer = styled.div`
  display: flex;
  background-color: ${colors.blueSky};
  @media (orientation: landscape) {
    width: 9rem;
  }
  @media (orientation: portrait) {
    height: 9rem;
  }
`;

export default connect(mapStateToProps, actionProps)(Root)
