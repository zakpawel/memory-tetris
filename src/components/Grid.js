import React from 'react';
import styled from 'styled-components';
import Rect from './Rect';

const G = styled.div`
  touch-action: none;
`;

const Row = styled.div`

`;

export default class Grid extends React.Component {
  render() {
    const { n, m } = this.props;
    const grid = [];
    for (let i=0; i<n; i++) {
      const row = [];
      for (let j=0; j<m; j++) {
        row[j] = 0;
      }
      grid[i] = row;
    }

    this.props.points.forEach(point => {
      const [x,y] = point;
      grid[x][y] = 1;
    })
    const x =
      grid.map(row =>
        <Row>
          {console.log(row) || row.map(cell =>
            cell === 1 ? <Rect color='#1ecc65' /> : <Rect />
          )}
        </Row>
      );
      console.log(grid, x);
    return <G>{x}</G>;
  }
}
