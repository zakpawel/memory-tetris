import React from 'react';
import Rect from '../components/Rect';
import styled from 'styled-components';
import interact from 'interactjs';
import ReactDOM from 'react-dom';

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
      position: { x: 0, y: 0 },
      block: { snapX: 0, snapY: 0, width: 0, height: 0 },
      gestureMode: false
    };
  }

  componentDidMount() {
    this.interactable =
    interact
    .pointerMoveTolerance(4)
    (ReactDOM.findDOMNode(this.node))
      .draggable({
    	   snap: {
          targets: [
            interact.createSnapGrid({ x: this.props.scale, y: this.props.scale })
          ],
          endOnly: true,
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        },
        // inertia: true,
        maxPerElement: 10,
        // keep the element within the area of it's parent
        // restrict: {
        //   restriction: "parent",
        //   endOnly: true,
        //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        // },
        // enable autoScroll
        // autoScroll: true,

        // call this function on every dragmove event
        onmove: this.onDragMove.bind(this),
        onend: this.onDragEnd.bind(this)
      })
      .gesturable({
        intertia: true,
        maxPerElement: 10,
        onmove: this.onGestureMove.bind(this),
        onend: this.onGestureEnd.bind(this)
      })
      // .preventDefault('always')
      .on(['dragstart', 'dragmove', 'draginertiastart',
      'dragend',
      'gesturestart', 'gesturemove', 'gestureend'], event => {
        // console.log(event)
      })
      // .actionChecker(
      //   function (pointer, event, action,
      //      interactable, element, interaction) {
      //        console.log(pointer, event, action)
      //        action.name = 'drag'
      //        return action;
      // })

      .on('tap', event => {
        this.setState((state, props) => ({
          ...state,
          gestureMode: !state.gestureMode
        }))
      })
  }

  onGestureMove(event) {
    if (!this.state.gestureMode) return;
    const { center: [cx,cy], scale: m } = this.props;
    const t = event.target;
    const a = (parseFloat(t.getAttribute('data-a')) || 0) + event.da;
    const x = (parseFloat(t.getAttribute('data-x')) || 0);
    const y = (parseFloat(t.getAttribute('data-y')) || 0);

    // t.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    t.setAttribute('transform', transform(x, y, cx, cy, a, m));
    t.setAttribute('data-a', a);
    t.setAttribute('data-x', x);
    t.setAttribute('data-y', y);
  }

  onGestureEnd(event) {
    const { center: [cx,cy], scale: m } = this.props;
    const t = event.target;
    const x = (parseFloat(t.getAttribute('data-x')) || 0);
    const y = (parseFloat(t.getAttribute('data-y')) || 0);
    const a = (parseFloat(t.getAttribute('data-a')) || 0);

    const n = Math.round(a/90);
    const na = n*90;

    // t.style.transform = `translate(${x}px, ${y}px) rotate(${na}deg)`;
    t.setAttribute('transform', transform(x, y, cx, cy, na, m));
    t.setAttribute('data-a', na);
    t.setAttribute('data-x', x);
    t.setAttribute('data-y', y);

    this.props.onRotate(na);
  }

  onDragEnd(event) {
    const t = event.target;
    const x = (parseFloat(t.getAttribute('data-x')) || 0);
    const y = (parseFloat(t.getAttribute('data-y')) || 0);

    this.props.onMove([x,y]);
  }

  onDragMove(event) {
    if (this.state.gestureMode) return;
    const t = event.target;
    const { location: [lx,ly], center: [cx,cy], angle, scale: m } = this.props;

    const x = (parseFloat(t.getAttribute('data-x')) || lx) + event.dx;
    const y = (parseFloat(t.getAttribute('data-y')) || ly) + event.dy;
    const a = (parseFloat(t.getAttribute('data-a')) || angle);
    // const o = {x,y,lx,ly,dx:event.dx, dy:event.dy}
    // console.log(event);

    // t.style.transform = `translate(${x}px, ${y}px) rotate(${a}deg)`;

    t.setAttribute('transform', transform(x, y, cx, cy, a, m));
    t.setAttribute('data-x', x);
    t.setAttribute('data-y', y);
  }

  componentDidUpdate2() {
    console.log('componentDidUpdate');
    const { location: [x,y], center: [cx,cy], angle: a, scale: m } = this.props;
    this.node.setAttribute('transform', transform(x, y, cx, cy, a, m));
    this.node.setAttribute('data-x', x);
    this.node.setAttribute('data-y', y);
    this.node.setAttribute('data-a', a);
  }

  render() {
    const { location: [lx,ly], center: [cx,cy], angle: a } = this.props;
    const m = this.props.scale;
    const R = `h${1}v${1}h${-1}z`;
    let d = "";
    this.props.points.forEach(([x,y]) => {
      d = ` ${d} M${x},${y} ${R}`;
    });
    return (
      <g
        ref={node => this.node = node}
        transform={transform(lx,ly,cx,cy,a,m)}
      >
        {
          this.state.gestureMode ?
            <circle
              cx={cx/m}
              cy={cy/m}
              r={180/m}
              fill="rgba(91, 171, 216, 0.2)"
            />
          : null
        }
        <path
          d={d}
          fill={this.props.color}
        />
        {
          this.state.gestureMode ?
            <Knob cx={cx} cy={cy} scale={m} />
          : null
        }
      </g>
    );
  }
}

const Knob = (({ cx,cy,scale }) =>
  <KnobScaled
    scale={scale}
  >
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="white"
    />
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#2196F3"
    />
  </KnobScaled>
)

const KnobScaled = styled.g`
  transform: ${props => `scale(${1/props.scale})` }
`;

const transform = (x, y, cx, cy, a, m) => `translate(${x}, ${y}) rotate(${a} ${cx} ${cy}) scale(${m})`;
