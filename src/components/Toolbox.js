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
import ToolboxDraggableShape from '../components/ToolboxDraggableShape';

export default class Toolbox extends React.Component {
  constructor(props) {
    super(props);

    this.internalState = {
      x: 0,
      y: 0,
      a: 0
    }
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this.rectRef);
    this.interactable = interact(this.node)
      .draggable({
        onmove: this.onDragMove.bind(this),
        onend: this.onDragEnd.bind(this)
      })
      .restrict({
        drag: document.body
      })
  }

  onDragMove(event) {
    const t = event.target;
    this.internalState = {
      ...this.internalState,
      x: this.internalState.x + event.dx,
      y: this.internalState.y + event.dy,
    };
    const { x, y } = this.internalState;
    console.log(x,y)
    t.setAttribute('transform', transform(x,y,0,0,0));
  }

  onDragEnd() {

  }

  render() {
    return (
      <div>
        <svg
          ref={node => { this.rectRef = node }}
          viewBox={`0 0 ${this.props.scale} ${this.props.scale}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {
            this.props.shapes.map((shape,i) => {
              return (
                <ToolboxDraggableShape
                  { ...shape }
                  key={i}
                />
              )
            })
          }
        </svg>
      </div>
    );
  }
}
