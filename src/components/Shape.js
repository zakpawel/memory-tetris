import React from 'react';
import styled from 'styled-components';

export default class Shape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0,
      offsetDiff: {
        left: 0,
        top: 0
      },
      moving: false,
      position: { x: 0, y: 0 }
    };
  }

  onStart(extract, e) {
    e.preventDefault();
    const {
      target,
      position
    } = extract(e);
    const clientRect = target.getBoundingClientRect();
    const offsetDiff = {
      left: position.clientX - clientRect.left,
      top: position.clientY - clientRect.top
    };
    this.setState((state, props) => {
      return {
        ...state,
        moving: true,
        offsetDiff
      };
    });
  }

  onEnd() {
    this.setState((state, props) => ({
      moving: false
    }));
  }

  onMove(extract, e) {
    e.preventDefault();
    const { position } = extract(e);
    this.setState((state, props) => {
      return {
        ...state,
        position: {
          x: position.clientX - state.offsetDiff.left,
          y: position.clientY - state.offsetDiff.top
        }
      };
    })
  }

  onMouseDown(e) {
    const { clientX, clientY } = e;
    this.onStart(e => ({
      target: e.currentTarget,
      position: { clientX, clientY }
    }), e);
  }

  onMouseUp(e) {
    this.onEnd(e);
  }

  onMouseMove(e) {
    if (this.state.moving) {
      const { clientX, clientY } = e;
      this.onMove(e => ({
        position: { clientX, clientY }
      }), e);
    }
  }

  onMouseEnter(e) {

  }

  onMouseLeave(e) {
    this.onEnd(e);
  }

  onTouchStart(e) {
    const { clientX, clientY } = e.touches[0]; // handle emptiness
    this.onStart(e => ({
      target: e.currentTarget,
      position: { clientX, clientY }
    }), e);
  }

  onTouchEnd(e) {
    this.onEnd(e);
  }

  onTouchCancel(e) {
    this.onEnd(e);
  }

  onTouchMove(e) {
    const { clientX, clientY } = e.touches[0]; // handle emptiness
    this.onMove(e => ({
      position: { clientX, clientY }
    }), e);
  }

  render() {
    return (
      <BaseShape
        angle={this.state.angle}
        x={this.state.position.x}
        y={this.state.position.y}
        moving={this.state.moving}
        onTouchStart={e => this.onTouchStart(e)}
        onTouchEnd={e => this.onTouchEnd(e)}
        onTouchMove={e => this.onTouchMove(e)}
        onTouchCancel={e => this.onTouchCancel(e)}
        onMouseEnter={e => this.onMouseEnter(e)}
        onMouseLeave={e => this.onMouseLeave(e)}
        onMouseDown={e => this.onMouseDown(e)}
        onMouseMove={e => this.onMouseMove(e)}
        onMouseUp={e => this.onMouseUp(e)}
      >
        {this.props.children}
      </BaseShape>
    );
  }
}

const BaseShape = styled.div`
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  touch-action: none;
  transform: ${props => `translate(${props.x}px, ${props.y}px) rotate(${props.angle}deg);`}
  box-shadow: ${props => props.moving ? `0px 0px 12px -2px black` : ''}
  z-index: 10;
`;
