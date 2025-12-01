// @flow
import type { Node } from 'react';

import { Component } from 'react';
import ReactModal from 'react-modal';

type Props = {
  isOpen: boolean,
  title?: string,
  width?: number,
  fullscreen?: boolean,
  children: Node,
  close: Function,
  onAfterOpen?: Function,
  style?: Object,
  overlayStyle?: Object,
  contentStyle?: Object,
};

class Modal extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onKeydown = this.onKeydown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown, false);
  }

  onKeydown = (event: any) => {
    if (event.keyCode === 27) {
      this.props.close();
    }
  };

  render() {
    const styles = {
      content: this.props.fullscreen
        ? {
            ...this.props.style,
            width: '100%',
            height: '100%',
          }
        : {
            ...this.props.style,
            width: this.props.width || 860,
          },
      ...this.props.contentStyle,
      overlay: {
        padding: this.props.fullscreen ? 20 : 30,
        ...this.props.overlayStyle,
      },
    };

    return (
      <ReactModal
        isOpen={this.props.isOpen}
        className="reactModal"
        overlayClassName="reactModal__overlay"
        contentLabel="Modal"
        style={styles}
        ariaHideApp={false}
        onAfterOpen={() => this.props.onAfterOpen && this.props.onAfterOpen()}
      >
        <div className="reactModal__content">
          <button
            type="button"
            onClick={this.props.close}
            className="reactModal__closeBtn icon-close"
          />
          {this.props.title ? (
            <h4 className="reactModal__title">{this.props.title}</h4>
          ) : null}
          {this.props.children}
        </div>
      </ReactModal>
    );
  }
}

export default Modal;
