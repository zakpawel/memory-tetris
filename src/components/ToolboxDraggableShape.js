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

export default class ToolboxDraggableShape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gestureMode: false
    };

    this.internalState = {
      x: 0,
      y: 0,
      a: 0
    };
  }

  setSnapGrid() {
    // const [sx,sy] = transformToPx(1,1,this.svg);
    // this.interactable.snap({
    //   targets: [
    //     interact.createSnapGrid({ x: sx, y: sy })
    //   ],
    //   endOnly: true,
    //   range: Infinity,
    //   relativePoints: [ { x: 0, y: 0 } ]
    // })
  }

  updateStateFromProps() {
    const { location: [x,y], angle: a } = this.props;
    // const [x,y] = transformToPx(lx,ly,this.svg);
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
    console.log(this.node, this.node.ownerSVGElement)
    this.svg = this.node;
    // const [sx,sy] = transformToPx(1,1,this.svg);

    this.interactable =
      interact
        .pointerMoveTolerance(4)(ReactDOM.findDOMNode(this.node))
        .draggable({
      	  //  snap: {
          //   targets: [
          //     interact.createSnapGrid({ x: sx, y: sy })
          //   ],
          //   endOnly: true,
          //   range: Infinity,
          //   relativePoints: [ { x: 0, y: 0 } ]
          // },
          // inertia: true,
          maxPerElement: 10,
          // keep the element within the area of it's parent
          restrict: {
            restriction: document.body,
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
    return [x,y,a];
    // const [tx,ty] = transformToSvg(x,y,this.svg);
    // return [tx,ty,a];
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
    return (
      <svg
        preserveAspectRatio="xMinYMin meet"
        ref={node => this.node = node}
        viewBox={`0 0 ${this.props.scale} ${this.props.scale}`}
      >
        <Shape { ...this.props }
          gestureMode={this.state.gestureMode}
          getRef={() => {}}
        />
      </svg>
    );
  }
}
