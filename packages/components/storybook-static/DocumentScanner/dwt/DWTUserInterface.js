// @flow
/* eslint-disable no-underscore-dangle, no-unused-expressions, no-bitwise */
import { forwardRef, Component } from 'react';
import DWTView from './DWTView';
import DWTController from './DWTController';
import type { ErrorObject } from '../index';

type Props = {
  Dynamsoft: Object,
  containerId: string,
  startTime: number,
  dwt: Object,
  status: number,
  buffer: Object,
  runtimeInfo: Object,
  handleBufferChange: Function,
  handleViewerSizeChange: Function,
  onSave: Function,
  onError: (errorObject: ErrorObject) => void,
  DWTControllerRef: Object,
  hideFilenameInput?: boolean,
};

/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {string} containerId the id of a DIV in which the view of Dynamic Web TWAIN will be built
 * @prop {number} startTime the time when initializing started
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {string} status a message to indicate the status of the application
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image
 * @prop {function} handleBufferChange a function to call when the buffer may requires updating
 */
class DWTUserInterface extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.status !== this.props.status) {
      const _statusChange = this.props.status - prevProps.status;
      const _text = this.statusChangeText(this.props.status, _statusChange);
      if (_text.indexOf('_ALLDONE_') !== -1) {
        this.handleOutPutMessage(_text.substr(9));
        this.handleOutPutMessage(
          `All ready... <initialization took ${
            new Date().getTime() - this.props.startTime
          } milliseconds>`,
          'important'
        );
      } else this.handleOutPutMessage(_text);
    }
    if (
      prevProps.buffer.current !== this.props.buffer.current ||
      this.props.buffer.updated
    ) {
      this.props.buffer.updated && this.props.handleBufferChange();
    }
  }

  statusChangeText(_status: number, _statusChange?: number) {
    let text = 'Initializing...';
    if (_statusChange) {
      text = [];
      _statusChange & 1 && text.push('Core module ');
      if (text.length > 1) text = text.join(' & ');
      // $FlowFixMe
      text += 'ready...';
    }
    return text;
  }

  handleOutPutMessage(message: string, type?: string) {
    switch (type) {
      case 'important':
        console.warn(`Dynamsoft log: ${message}`);
        break;
      case 'error':
        console.error(`Dynamsoft log: ${message}`);
        break;
      default:
        console.log(`Dynamsoft log: ${message}`);
        break;
    }
  }

  handleException(ex: Object) {
    this.handleOutPutMessage(ex.message, 'error');
    this.props.onError({ code: ex.code, message: ex.message });
  }

  render() {
    return (
      <div id="DWTcontainer" className="DWTcontainer">
        <div
          style={{
            textAlign: 'left',
            position: 'relative',
            float: 'left',
            width: '968px',
          }}
          className="fullWidth clearfix"
        >
          <DWTView
            dwt={this.props.dwt}
            buffer={this.props.buffer}
            containerId={this.props.containerId}
            handleViewerSizeChange={(viewSize) =>
              this.props.handleViewerSizeChange(viewSize)
            }
            handleBufferChange={() => this.props.handleBufferChange()}
            handleOutPutMessage={(message, type) =>
              this.handleOutPutMessage(message, type)
            }
          />
          <DWTController
            Dynamsoft={this.props.Dynamsoft}
            startTime={this.props.startTime}
            dwt={this.props.dwt}
            buffer={this.props.buffer}
            runtimeInfo={this.props.runtimeInfo}
            handleException={(ex) => this.handleException(ex)}
            handleOutPutMessage={(message, type) =>
              this.handleOutPutMessage(message, type)
            }
            onSave={(file) => this.props.onSave(file)}
            ref={this.props.DWTControllerRef}
            hideFilenameInput={this.props.hideFilenameInput}
          />
        </div>
      </div>
    );
  }
}

export default forwardRef<Props, Object>((props, ref) => (
  <DWTUserInterface DWTControllerRef={ref} {...props} />
));
