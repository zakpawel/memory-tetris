import React from 'react';
import styled from 'styled-components';
import interact from 'interactjs';
import ReactDOM from 'react-dom';
import Shape from '../components/Shape';

import {
  transformToPx,
  transformToSvg,
  transformByMatrix,
  transform
} from '../utils';

export default class DraggableShape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationMode: false
    };

    this.internalState = {
      x: 0,
      y: 0,
      a: 0,
      da: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState((state,props) => ({
      ...state,
      rotationMode: state.rotationMode && nextProps.canMove
    }));
  }

  componentDidUpdate() {
    if (this.internalState.moving) return;
    this.updateStateFromProps();
    const [x,y,a] = this.getSvgCoordinates();
    const { center: [cx,cy] } = this.props;

    // XXX: why render() does not update this attribute?
    this.node.setAttribute('transform', transform(x, y, cx, cy, a));
  }

  componentWillUnmout() {
    // XXX: some clean-up?
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.svg = this.node.ownerSVGElement;
    const [snapx,snapy] = transformToPx(1,1,this.svg);
    this.updateStateFromProps();

    this.interactable =
      interact
        .pointerMoveTolerance(4)(ReactDOM.findDOMNode(this.node))
        .preventDefault('always')
        .draggable({
      	   snap: {
            targets: [
              interact.createSnapGrid({ x: snapx, y: snapy })
            ],
            endOnly: true,
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
          },
          restrict: {
            restriction: 'parent',
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          onmove: this.onDragMove.bind(this),
          onend: this.onDragEnd.bind(this)
        })
        .on('tap', this.onTap.bind(this));

  }

  resizeHandler(event) {
    this.setSnapGrid();
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

  setPxCoordinates(dx, dy) {
    this.internalState = {
      ...this.internalState,
      x: this.internalState.x + dx,
      y: this.internalState.y + dy,
    };
  }

  setDA(da) {
    this.internalState = {
      ...this.internalState,
      da
    };
  }

  setMoving(moving) {
    this.internalState = {
      ...this.internalState,
      moving
    };
  }

  updateStateFromProps() {
    const { location: [lx,ly], angle: a } = this.props;
    const [x,y] = transformToPx(lx,ly,this.svg);
    this.internalState = {
      ...this.internalState,
      x,y,a,da:0
    }
  }

  updateTargetPosition(event) {
    const {target: t, dx, dy, da } = event;
    const { center: [cx,cy], angle: a } = this.props;
    this.setPxCoordinates(dx, dy, da);
    this.setMoving(true);
    const [x,y] = this.getSvgCoordinates();
    t.setAttribute('transform', transform(x, y, cx, cy, a));
  }

  updateTargetByAngle(target, da) {
    const { center: [cx,cy] } = this.props;
    this.setDA(da);
    this.setMoving(true);
    const [x,y,a] = this.getSvgCoordinates();
    target.setAttribute('transform', transform(x, y, cx, cy, a));
  }

  updateFinalAngle() {
    const [x,y,a] = this.getSvgCoordinates();
    const n = Math.round(a/90);
    const na = n*90;

    this.setDA(0);
    this.setMoving(false);

    this.props.onRotate(na);
  }

  updateFinalPosition(target) {
    const { center: [cx,cy], angle: a } = this.props;
    let [x,y] = this.getSvgCoordinates();
    x = Math.round(x);
    y = Math.round(y);
    target.setAttribute('transform', transform(x, y, cx, cy, a));

    this.internalState = {
      ...this.internalState,
      moving: false
    }

    this.props.onMove([x,y]);
  }

  getSvgCoordinates() {
    const { x,y,a,da } = this.internalState;
    const [tx,ty] = transformToSvg(x,y,this.svg);
    return [tx,ty,a+da];
  }

  computeAngle(event) {
    const { location: [lx,ly], center: [cx,cy], angle: a } = this.props;
    const [xx,yy] = transformToPx(lx+cx,ly+cy,this.svg);
    const { clientX0, clientY0, clientX, clientY } = event;

    const x2 = clientX - xx;
    const x1 = clientX0 - xx;
    const y2 = clientY - yy;
    const y1 = clientY0 - yy;

    const dot = x1*x2 + y1*y2;
    const det = x1*y2 - y1*x2;
    let angle = Math.atan2(det, dot);
    angle = angle / Math.PI * 180;

    return angle;
  }

  onTap(event) {
    this.setState((state, props) => {
      return (
        props.canMove
        ? {
          ...state,
          rotationMode: !state.rotationMode
        }
        : state
      );
    })
  }

  onDragMove(event) {
    if (!this.props.canMove) return;

    if (this.state.rotationMode) {
      if (!event.snap.locked) {
        const angle = this.computeAngle(event);
        this.updateTargetByAngle(event.target, angle)
      }
    } else {
      this.updateTargetPosition(event);
    }
  }

  onDragEnd(event) {
    if (!this.props.canMove) return;

    if (this.state.rotationMode) {
      this.setState((state,props) => {
        return {
          ...state,
          rotationMode: false
        };
      }, () => {
        this.updateFinalAngle(event);
      });
    } else {
      this.updateFinalPosition(event.target);
    }
  }

  render() {
    return (
      <Shape { ...this.props }
        rotationMode={this.state.rotationMode}
      />
    );
  }
}
