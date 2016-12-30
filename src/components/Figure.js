import React from 'react';
import styled from 'styled-components';

export default class Figure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0,
      touch: {
        start: { x: 0, y: 0 },
        move: { x: 0, y: 0 }
      }
    };
  }

  onTouchStart(e) {
    e.preventDefault();
    const first = e.touches[0];
    this.setState((prevState, props) => {
      return {
        ...prevState,
        touch: {
          ...prevState.touch,
          start: { x: first.clientX, y: first.clientY }
        }
      };
    });
  }

  onTouchEnd() {

  }

  onTouchMove(e) {
    e.preventDefault();
    const first = e.touches[0];
    this.setState((prevState, props) => {
      return {
        ...prevState,
        touch: {
          ...prevState.touch,
          move: { x: first.clientX, y: first.clientY }
        }
      };
    })
  }

  onTouchCancel() {

  }



  render() {
    return (
      <_Figure
        angle={this.state.angle}
        x={this.state.touch.move.x}
        y={this.state.touch.move.y}
        onTouchStart={e => this.onTouchStart(e)}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={e => this.onTouchMove(e)}
        onTouchCancel={this.onTouchCancel}
      >
        {this.props.children}
      </_Figure>
    );
  }
}

const _Figure = styled.div`
  display: inline-block;
  position: absolute;
  touch-action: none;
  transform: ${props => `translate(${props.x}px, ${props.y}px) rotate(${props.angle}deg);`}
`;
