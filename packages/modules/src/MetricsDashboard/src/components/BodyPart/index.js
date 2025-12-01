// @flow
import { Component } from 'react';

type Props = {
  bodyPart: string,
  score: ?number,
  pos: Object,
  size: Object,
  scoreOffset: { left?: number, top?: number },
  svgData: string,
  viewBox: string,
  opacity?: number,
  active: boolean,
  setActive?: (string) => void,
};

// active and inactive state colours
const activeColour = '#3A8DEE';
const inactiveColour = '#0E478A ';

export default class BodyPart extends Component<
  Props,
  {
    hover: boolean,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = { hover: false };
  }

  setHoverStyle() {
    if (this.state.hover) {
      this.setState({ hover: false });
    } else {
      this.setState({ hover: true });
    }
  }

  render() {
    return (
      <div
        className="bodyPartContainer"
        style={{
          position: 'absolute',
          top: `${this.props.pos.y}px`,
          left: `${this.props.pos.x}px`,
          cursor: this.state.hover ? 'pointer' : '',
        }}
      >
        <span
          style={{
            left: {}.hasOwnProperty.call(this.props.scoreOffset, 'left')
              ? this.props.scoreOffset.left
              : '50%',
            top: {}.hasOwnProperty.call(this.props.scoreOffset, 'top')
              ? this.props.scoreOffset.top
              : '50%',
          }}
          onClick={() =>
            this.props.setActive
              ? this.props.setActive(this.props.bodyPart)
              : null
          }
        >
          {this.props.score}
        </span>
        <svg
          width={`${this.props.size.width}px`}
          height={`${this.props.size.height}px`}
          viewBox={this.props.viewBox}
          fill={this.props.active ? activeColour : inactiveColour}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <desc />
          <defs />
          <path
            d={this.props.svgData}
            id="Pectoral"
            stroke="none"
            fillOpacity={this.props.opacity}
            onClick={() =>
              this.props.setActive
                ? this.props.setActive(this.props.bodyPart)
                : null
            }
            onMouseEnter={() => this.setHoverStyle()}
            onMouseLeave={() => this.setHoverStyle()}
          />
        </svg>
      </div>
    );
  }
}

// $FlowFixMe
BodyPart.defaultProps = {
  opacity: 0.8,
  scoreOffset: {
    top: 50,
    left: 50,
  },
  active: false,
};
