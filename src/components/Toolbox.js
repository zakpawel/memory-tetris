import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import interact from 'interactjs';
import  {
  transformToPx,
  transformToSvg,
  transformByMatrix,
  transform
} from '../utils';

export default class Toolbox extends React.Component {
  constructor(props) {
    super(props);

    this.internalState = {
      x: 0,
      y: 0,
      a: 0
    }
  }

  onShapeMove(e,i) {

  }

  onShapeRotate(e,i) {

  }

  render() {
    return (
      <div>
        {
          this.props.shapes.map((shape,i) => {
            return (
              <ToolboxDraggableShape
                { ...shape }
                scale={this.props.scale}
                key={i}
                onMove={e => this.onShapeMove(e, i)}
                onRotate={e => this.onShapeRotate(e, i)}
              />
            )
          })
        }
      </div>
    );
  }
}
