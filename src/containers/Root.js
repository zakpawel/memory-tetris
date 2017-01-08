import React from 'react';
import styled from 'styled-components';
import DraggableShape from '../components/DraggableShape';
import Toolbox from '../components/Toolbox';
import { rotateShape, randomShape, randomGrid } from '../utils';
import shapePrototypes from '../shapes';

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    const [grid, shapes] = randomGrid(shapePrototypes, 12, 12);
    this.state = {
      grid,
      shapes,
      scale: 12,
    }
  }

  onShapeMove([x,y], i) {
    console.log('onShapeMove', x,y);
    const m = this.state.scale;
    this.setState((state, props) => ({
        ...state,
        shapes: Object.assign(
          [], state.shapes,
          { [i]: {
            ...state.shapes[i],
            location: [x,y]
            }
          })
    }))
  }

  onShapeRotate(angle, i) {
    console.log('onShapeRotate', angle);
    this.setState((state, props) => ({
        ...state,
        shapes: Object.assign(
          [],
          state.shapes,
          {
            [i]: rotateShape(state.shapes[i], angle)
          })
    }));
  }

  render() {
    return (
        <Container>
          <SvgContainer>
            <Svg
              viewBox={`0 0 ${this.state.scale} ${this.state.scale}`}
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
              { this.state.shapes.map((shape, i) => {
                return (
                  <DraggableShape
                    { ...shape }
                    key={i}
                    scale={this.state.scale}
                    onMove={e => this.onShapeMove(e, i)}
                    onRotate={e => this.onShapeRotate(e, i)}
                  />
                );
              }) }
            </Svg>
          </SvgContainer>
          <ToolboxStyled>
            <Toolbox
              scale={this.state.scale}
              shapes={this.state.shapes}
            />
          </ToolboxStyled>
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
    height: 100%;
  }
`;

const Svg = styled.svg`
  @media (orientation: landscape) {
    height: 100%;
  }
`;

const ToolboxStyled = styled.div`
  flex: 1 1 100%;
  @media (orientation: landscape) {
    background-color: lightgreen;
  }
  @media (orientation: portrait) {
    background-color: red;
  }
`;
