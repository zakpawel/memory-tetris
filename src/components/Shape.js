import React from 'react';
// import Grid from '../components/Grid';
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
      rotateMode: false
    };
  }

  componentDidMount() {
    this.interactable =
    interact
    .pointerMoveTolerance(4)
    (ReactDOM.findDOMNode(this.path))
      .draggable({
    	   snap: {
          targets: [
            interact.createSnapGrid({ x: 32, y: 32 })
          ],
          endOnly: true,
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        },
        // enable inertial throwing
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
        onmove: this.ionMove.bind(this)
      })
      .gesturable({
        intertia: true,
        maxPerElement: 10,
        onmove: this.onrotate.bind(this)
      })
      // .preventDefault('always')
      .on(['dragstart', 'dragmove', 'draginertiastart',
      'dragend',
      'gesturestart', 'gesturemove', 'gestureend'], event => {
        console.log(event)
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
          rotateMode: !state.rotateMode
        }))
      })
  }

  onrotate(event) {
    if (!this.state.rotateMode) return;
    console.log('onrotate', event.type);

//     var interaction = event.interaction;
//
//         // if (!interaction.interacting()) {
//           // console.log('onrotate drag start');
//           interaction.start({ name: 'dragmove' },
//                             event.interactable,
//                             event.currentTarget)
//                           // }
// event.type = 'dragmove'
//                           event.interactable.fire(event);

    const t = event.target;
    const angle = (parseFloat(t.getAttribute('data-a')) || 0) + event.da;
    const x = (parseFloat(t.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(t.getAttribute('data-y')) || 0) + event.dy;
    // const x = (parseFloat(t.getAttribute('data-x')) || 0);
    // const y = (parseFloat(t.getAttribute('data-y')) || 0);

    t.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    t.setAttribute('data-a', angle);
    t.setAttribute('data-x', x);
    t.setAttribute('data-y', y);
  }

  ionMove(event) {
    if (this.state.rotateMode) return;
      // console.log('onmove', event.dx, event.dy, this.state.position);
      const t = event.target;
      const x = (parseFloat(t.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(t.getAttribute('data-y')) || 0) + event.dy;
      const angle = (parseFloat(t.getAttribute('data-a')) || 0);

      t.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
      t.setAttribute('data-x', x);
      t.setAttribute('data-y', y);
  }

  snap(left, top, width, height) {
    return {
      snapX: Math.round(left / width),
      snapY: Math.round(top / height)
    };
  }

  render() {
    const m = 32;
    const R = `h${m}v${m}h${-m}z`;
    let d = "";
    this.props.points.forEach(point => {
      const [x,y] = point;
      d = ` ${d} M${x*m},${y*m} ${R}`;
    })
    return (
      <Svg>
        <path
          d={d}
          ref={path => this.path = path}
          fill="lightgreen"
        />
      </Svg>
    );
  }
}

const Grid = styled.div`
  touch-action: none;
`;

const Row = styled.div`
  touch-action: none;
`;


const Svg = styled.svg`
  width: 100%;
  height: 100%;
  touch-action: none;
`;
