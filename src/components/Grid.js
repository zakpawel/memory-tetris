import React from 'react';
import styled from 'styled-components';
import Rect from './Rect';

const G = styled.div`

`;

const Row = styled.div`

`;

export default class Grid extends React.Component {
  renderRow(i,n) {
    const row = [];

    for (let k = 0; k < n; k++) {
      row[k] = <Rect />
    }

    return <Row>{row}</Row>;
  }

  render() {
    const grid = [];

    for (let k = 0; k < this.props.size; k++) {
      grid[k] = this.renderRow(k, this.props.size);
    }

    return (
      <G>{grid}</G>
    );
  }
}
