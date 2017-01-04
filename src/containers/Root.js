import React from 'react';
import Grid from '../components/Grid';
import Rect from '../components/Rect';
import Shape from '../components/Shape';
import styled from 'styled-components';
import { rotateShape, randomShape, randomGrid } from '../utils';

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
  constructor(props) {
    super(props);
    const shapePrototypes = [
      { location: [0,0],
        points: [[0,2], [1,2], [1,1], [2,1]],
        color: '#E73F3F',
        center: [2,2],
        angle: 0,
      },
      { location: [10,10],
        points: [[0,0], [0,1], [0,2], [0,3]],
        color: '#E7E737',
        center: [1,2],
        angle: 0,
      },
      { location: [15,10],
        points: [[0,0], [0,1], [1,0], [1,1]],
        color: '#6D9DD1',
        center: [1,1],
        angle: 0,
      },
      { location: [10,15],
        points: [[0,0], [0,1], [0,2], [1,2]],
        color: '#7FC31C',
        center: [1,1],
        angle: 0,
      }
    ];
    const [grid, shapes] = randomGrid(shapePrototypes, 10, 10);
    this.state = {
      grid,
      shapes,
      scale: 64,
    }
  }

  onShapeMove([x,y], i) {
    console.log('Move', x,y);
    const m = this.state.scale;
    this.setState((state, props) => ({
        ...state,
        shapes: Object.assign(
          [], state.shapes,
          { [i]: {
            ...state.shapes[i],
            location: [x/m,y/m]
            }
          })
    }))
  }

  onShapeRotate(angle, i) {
    console.log('Rotate', angle);
    this.setState((state, props) => ({
        ...state,
        shapes: Object.assign(
          [], state.shapes,
          {
            [i]: rotateShape(state.shapes[i], angle)
          })
    }));
  }

  render() {
    return (
      <div>
        <Grid scale={this.state.scale} gridPoints={this.state.grid} />
        <Container>
          <Svg>
            { this.state.shapes.map((shape, i) => {
              const { location: [lx,ly], center: [cx,cy] } = shape;
              const m = this.state.scale;
              const props = {
                ...shape,
                location: [
                  lx * m,
                  ly * m
                ],
                center: [
                  cx * m,
                  cy * m
                ]
              };

              return (
                <Shape
                  { ...props }
                  key={i}
                  scale={this.state.scale}
                  onMove={e => this.onShapeMove(e, i)}
                  onRotate={e => this.onShapeRotate(e, i)}
                />
              );
            }) }
          </Svg>
        </Container>
      </div>
    );
  }
}

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  touch-action: none;
`;
