import React from 'react';
import styled from 'styled-components';
import interact from 'interactjs';
import ReactDOM from 'react-dom';

export default class DraggableShape extends React.Component {
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

    this.internalState = {
      x: 0,
      y: 0,
      a: 0
    };
  }

  setSnapGrid() {
    const [sx,sy] = transformToPx(1,1,this.svg);
    this.interactable.snap({
      targets: [
        interact.createSnapGrid({ x: sx, y: sy })
      ],
      endOnly: true,
      range: Infinity,
      relativePoints: [ { x: 0, y: 0 } ]
    })
  }

  updateStateFromProps() {
    const { location: [lx,ly], angle: a } = this.props;
    const [x,y] = transformToPx(lx,ly,this.svg);
    this.internalState = {
      ...this.internalState,
      x,y,a
    }
  }

  componentDidUpdate() {
    this.updateStateFromProps();
    const [x,y,a] = this.getSvgCoordinates();
    const { center: [cx,cy] } = this.props;

    // why render() does not update this attribute?
    this.node.setAttribute('transform', transform(x, y, cx, cy, a));
  }

  componentWillUnmout() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.resizeHandler = e => {
      console.log('Resize', e);
      this.setSnapGrid();
    };
    window.addEventListener('resize', this.resizeHandler);
    this.svg = this.node.ownerSVGElement;
    const [sx,sy] = transformToPx(1,1,this.svg);

    this.interactable =
    interact
    .pointerMoveTolerance(4)(ReactDOM.findDOMNode(this.node))
      .draggable({
    	   snap: {
          targets: [
            interact.createSnapGrid({ x: sx, y: sy })
          ],
          endOnly: true,
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        },
        // inertia: true,
        maxPerElement: 10,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        // autoScroll: true,

        // call this function on every dragmove event
        onmove: this.onDragMove.bind(this),
        onend: this.onDragEnd.bind(this)
      })
      .gesturable({
        maxPerElement: 10,
        onmove: this.onGestureMove.bind(this),
        onend: this.onGestureEnd.bind(this)
      })
      .preventDefault('always')
      // .actionChecker(
      //   function (pointer, event, action,
      //      interactable, element, interaction) {
      //        console.log(pointer, event, action)
      //        action.name = 'gesture';
      //        return action;
      // });

      .on('tap', event => {
        this.setState((state, props) => ({
          ...state,
          gestureMode: !state.gestureMode
        }))
      })
      this.updateStateFromProps();
  }

  setPxCoordinates(event) {
    this.internalState = {
      x: this.internalState.x + event.dx,
      y: this.internalState.y + event.dy,
      a: this.internalState.a + (event.da ? event.da : 0)
    };
  }

  setAngleCoordinates(event) {
    this.internalState = {
      ...this.internalState,
      a: this.internalState.a + (event.da ? event.da : 0)
    };
  }

  getSvgCoordinates() {
    const { x,y,a } = this.internalState;
    const [tx,ty] = transformToSvg(x,y,this.svg);
    return [tx,ty,a];
  }

  onGestureMove(event) {
    if (!this.state.gestureMode) return;

    const t = event.target;
    const { center: [cx,cy], angle } = this.props;
    this.setAngleCoordinates(event);
    const [x,y,a] = this.getSvgCoordinates();
    t.setAttribute('transform', transform(x, y, cx, cy, a));
  }

  onGestureEnd(event) {
    // figure out why gesture move is so slugish
    const t = event.target;
    // const { center: [cx,cy] } = this.props;
    const [x,y,a] = this.getSvgCoordinates();
    const n = Math.round(a/90);
    const na = n*90;

    this.props.onRotate(na);
  }

  onDragEnd(event) {
    const t = event.target;
    const { center: [cx,cy], angle: a } = this.props;
    const [x,y] = this.getSvgCoordinates();
    t.setAttribute('transform', transform(x, y, cx, cy, a));

    this.props.onMove([x,y]);
  }

  onDragMove(event) {
    if (this.state.gestureMode) return;
    const t = event.target;
    const { center: [cx,cy], angle: a } = this.props;
    this.setPxCoordinates(event);
    const [x,y] = this.getSvgCoordinates();
    t.setAttribute('transform', transform(x, y, cx, cy, a));
  }

  render() {
    const { location: [lx,ly], center: [cx,cy], angle: a } = this.props;
    const rect = `h${1}v${1}h${-1}z`;
    let d = "";
    this.props.points.forEach(([x,y]) => {
      d = `${d} M${x},${y} ${rect}`;
    });
    return (
      <g
        ref={node => this.node = node}
        transform={transform(lx,ly,cx,cy,a)}
      >
        {
          this.state.gestureMode ?
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
          this.state.gestureMode ?
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

function transformToPx(x, y, svg) {
  const point = svg.createSVGPoint();
  const matrix = svg.getScreenCTM();
  return transformByMatrix(x, y, point, matrix);
}

function transformToSvg(x, y, svg) {
  const point = svg.createSVGPoint();
  const matrix = svg.getScreenCTM().inverse();
  return transformByMatrix(x, y, point, matrix);
}

function transformByMatrix(x, y, point, matrix) {
  point.x = x;
  point.y = y;
  const newPoint = point.matrixTransform(matrix)
  const tx = newPoint.x;
  const ty = newPoint.y;
  return [tx,ty];
}

const transform = (x, y, cx, cy, a) => {
  return `translate(${x}, ${y}) rotate(${a} ${cx} ${cy})`;
}
