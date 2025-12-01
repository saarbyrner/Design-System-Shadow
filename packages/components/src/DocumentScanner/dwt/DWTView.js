// @flow
/* eslint-disable react/sort-comp, jsx-a11y/tabindex-no-positive, react/no-did-update-set-state, no-underscore-dangle, jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import { TextButton, Select } from '@kitman/components';

type Props = {
  dwt: Object,
  buffer: Object,
  containerId: string,
  handleBufferChange: Function,
  handleOutPutMessage: Function,
  handleViewerSizeChange: Function,
};

type State = {
  viewReady: boolean,
  previewMode: string,
};

/**
 * @props
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {string} containerId the id of a DIV in which the view of Dynamic Web TWAIN will be built
 * @prop {function} handleBufferChange a function to call when the buffer may requires updating
 * @prop {function} handleOutPutMessage a function to call a message needs to be printed out
 */
export default class DWTView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewReady: false,
      previewMode: '1',
    };
  }

  re = /^\d+$/;

  DWObject = null;

  width = '583px';

  height = '513px';

  navigatorRight = '60px';

  navigatorWidth = '585px';

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.dwt !== prevProps.dwt) {
      this.DWObject = this.props.dwt;
      this.setState({ viewReady: true });
    }
    if (
      this.DWObject !== null &&
      this.state.viewReady &&
      !prevState.viewReady
    ) {
      this.DWObject.Viewer.width = this.width;
      this.DWObject.Viewer.height = this.height;
    }
    if (document.getElementById(this.props.containerId)?.offsetWidth !== 0) {
      this.props.handleViewerSizeChange({
        width: document.getElementById(this.props.containerId)?.offsetWidth,
        height: document.getElementById(this.props.containerId)?.offsetHeight,
      });
    }
  }

  // Quick Edit
  handleQuickEdit(event: Object) {
    if (event.keyCode && event.keyCode !== 32) return;
    if (this.props.buffer.count === 0) {
      this.props.handleOutPutMessage('There is no image in Buffer!', 'error');
      return;
    }

    switch (event.target.getAttribute('value')) {
      case 'rotateL':
        this.DWObject?.RotateLeft(this.props.buffer.current);
        break;
      case 'rotateR':
        this.DWObject?.RotateRight(this.props.buffer.current);
        break;
      case 'mirror':
        this.DWObject?.Mirror(this.props.buffer.current);
        break;
      case 'flip':
        this.DWObject?.Flip(this.props.buffer.current);
        break;
      case 'removeS':
        this.DWObject?.RemoveAllSelectedImages();
        break;
      case 'removeA':
        this.DWObject?.RemoveAllImages();
        this.handleNavigation('removeAll');
        break;
      default:
        break;
    }
  }

  handleNavigation(action: string) {
    switch (action) {
      default:
        // viewModeChange, removeAll
        break;
      case 'first':
        // $FlowFixMe
        this.DWObject.CurrentImageIndexInBuffer = 0;
        break;
      case 'last':
        // $FlowFixMe
        this.DWObject.CurrentImageIndexInBuffer = this.props.buffer.count - 1;
        break;
      case 'previous':
        // $FlowFixMe
        this.DWObject.CurrentImageIndexInBuffer =
          this.props.buffer.current > 0 && this.props.buffer.current - 1;
        break;
      case 'next':
        // $FlowFixMe
        this.DWObject.CurrentImageIndexInBuffer =
          this.props.buffer.current < this.props.buffer.count - 1 &&
          this.props.buffer.current + 1;
        break;
    }
    this.props.handleBufferChange();
  }

  handlePreviewModeChange(event: Object) {
    let _newMode = '';
    if (event && event.target) {
      _newMode = event.target.value;
    } else if (parseInt(event, 10) > 0 && parseInt(event, 10) < 6) {
      _newMode = parseInt(event, 10).toString();
    }
    if (_newMode !== this.state.previewMode) {
      this.setState({ previewMode: _newMode });
      this.DWObject?.Viewer.setViewMode(
        parseInt(_newMode, 10),
        parseInt(_newMode, 10)
      );
      // $FlowFixMe
      this.DWObject.MouseShape = parseInt(_newMode, 10) > 1;
      this.handleNavigation('viewModeChange');
    }
  }

  render() {
    return (
      <>
        <div
          style={{ display: this.state.viewReady ? 'none' : 'block' }}
          className="DWTcontainerTop"
        />
        <div
          style={{ display: this.state.viewReady ? 'block' : 'none' }}
          className="DWTcontainerTop"
        >
          <div
            style={
              this.state.viewReady ? { display: 'block' } : { display: 'none' }
            }
            className="divEdit"
          >
            <ul
              className="operateGrp"
              onKeyUp={(event) => this.handleQuickEdit(event)}
              onClick={(event) => this.handleQuickEdit(event)}
            >
              <li>
                <img
                  tabIndex="6"
                  value="rotateL"
                  src="/img/dwt/RotateLeft.png"
                  title="Rotate Left"
                  alt="Rotate Left"
                />{' '}
              </li>
              <li>
                <img
                  tabIndex="6"
                  value="rotateR"
                  src="/img/dwt/RotateRight.png"
                  title="Rotate Right"
                  alt="Rotate Right"
                />{' '}
              </li>
              <li>
                <img
                  tabIndex="6"
                  value="mirror"
                  src="/img/dwt/Mirror.png"
                  title="Mirror"
                  alt="Mirror"
                />{' '}
              </li>
              <li>
                <img
                  tabIndex="6"
                  value="flip"
                  src="/img/dwt/Flip.png"
                  title="Flip"
                  alt="Flip"
                />{' '}
              </li>
              <li>
                <img
                  tabIndex="6"
                  value="removeS"
                  src="/img/dwt/RemoveSelectedImages.png"
                  title="Remove Selected Images"
                  alt="Remove Selected Images"
                />
              </li>
              <li>
                <img
                  tabIndex="6"
                  value="removeA"
                  src="/img/dwt/RemoveAllImages.png"
                  title="Remove All Images"
                  alt="Remove All"
                />
              </li>
            </ul>
          </div>
          <div
            style={{
              position: 'relative',
              float: 'left',
              width: this.width,
              height: this.height,
            }}
            id={this.props.containerId}
          />
          <div
            style={
              this.state.viewReady
                ? {
                    display: 'block',
                    width: this.navigatorWidth,
                    left: this.navigatorRight,
                  }
                : { display: 'none' }
            }
            className="navigatePanel clearfix"
          >
            <div className="ct-lt fullWidth tc floatL">
              <TextButton
                iconBefore="icon-last-left"
                type="secondary"
                onClick={() => this.handleNavigation('first')}
                kitmanDesignSystem
                tabIndex="7"
              />
              &nbsp;
              <TextButton
                iconBefore="icon-next-left"
                type="secondary"
                onClick={() => this.handleNavigation('previous')}
                kitmanDesignSystem
                tabIndex="7"
              />
              <div className="DWT__pageCounter">
                {this.props.buffer.current > -1
                  ? this.props.buffer.current + 1
                  : '-'}
                /{this.props.buffer.count > 0 ? this.props.buffer.count : '-'}
              </div>
              <TextButton
                iconBefore="icon-next-right"
                type="secondary"
                onClick={() => this.handleNavigation('next')}
                kitmanDesignSystem
                tabIndex="7"
              />
              &nbsp;
              <TextButton
                iconBefore="icon-last-right"
                type="secondary"
                onClick={() => this.handleNavigation('last')}
                kitmanDesignSystem
                tabIndex="7"
              />
              <div className="previewMode">
                <Select
                  tabIndex="7"
                  value={this.state.previewMode}
                  onChange={(event) => this.handlePreviewModeChange(event)}
                  options={[
                    {
                      label: '1X1',
                      value: '1',
                    },
                    {
                      label: '2X2',
                      value: '2',
                    },
                    {
                      label: '3X3',
                      value: '3',
                    },
                    {
                      label: '4X4',
                      value: '4',
                    },
                    {
                      label: '5X5',
                      value: '5',
                    },
                  ]}
                  appendToBody
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
