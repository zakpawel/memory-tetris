import React from 'react';
import styled from 'styled-components';
import { transform } from '../utils';

export default class Shape extends React.Component {
  render() {
    const { location: [lx,ly], center: [cx,cy], angle: a } = this.props;
    const rect = `h${1}v${1}h${-1}z`;
    let d = "";
    this.props.points.forEach(([x,y]) => {
      d = `${d} M${x},${y} ${rect}`;
    });

    return (
      <g transform={transform(lx,ly,cx,cy,a)}>
        {
          this.props.rotationMode ?
            <circle
              cx={cx}
              cy={cy}
              r={3}
              fill="rgba(91, 171, 216, 0.2)"
            />
          : null
        }
        <path
          d={d}
          fill={this.props.color}
        />
        {
          this.props.rotationMode ?
            <Knob cx={cx} cy={cy} />
          : null
        }
      </g>
    );
  }
}

const Knob = (({ cx,cy }) =>
  <KnobScaled>
    <circle
      cx={cx}
      cy={cy}
      r={0.12}
      fill="white"
    />
    <circle
      cx={cx}
      cy={cy}
      r={0.1}
      fill="#2196F3"
    />
  </KnobScaled>
)

const KnobScaled = styled.g`

`;
