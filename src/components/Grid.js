import React from 'react';
import styled from 'styled-components';
import Rect from './Rect';

export default class Grid extends React.Component {
  render() {
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d={`M ${1/20} 0 L 0 0 0 1`} fill="none" stroke="gray" strokeWidth="0.01"/>
            <path d={`M ${1/20} 0 L 0 0 1 0`} fill="none" stroke="gray" strokeWidth="0.01"/>
          </pattern>
        </defs>
        <rect transform={`scale(${this.props.scale})`} width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  }
}
