// @flow
/* eslint-disable react/sort-comp, max-statements, no-underscore-dangle, camelcase */
import { Component, forwardRef } from 'react';
import Dynamsoft from 'dwt';
import DWTUserInterface from './DWTUserInterface';
import type { ErrorObject } from '../index';

type Props = {
  onSave: Function,
  onError: (errorObject: ErrorObject) => void,
  onBufferChange: Function,
  DWTControllerRef: Object,
  hideFilenameInput?: boolean,
};

type State = {
  startTime: number,
  dwt: Object,
  status: number,
  buffer: Object,
  runtimeInfo: Object,
};

class DWT extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startTime: new Date().getTime(),
      dwt: null,
      /** status
       * 0:  "Initializing..."
       * 1:  "Core Ready..." (scan)
       */
      status: this.initialStatus,
      buffer: {
        updated: false,
        count: 0,
        current: -1,
      },
      runtimeInfo: {
        curImageTimeStamp: null,
        showAbleWidth: 0,
        showAbleHeight: 0,
        ImageWidth: 0,
        ImageHeight: 0,
      },
    };
  }

  initialStatus = 0;

  DWObject = null;

  containerId = 'dwtcontrolContainer';

  width = 583;

  height = 513;

  modulizeInstallJS() {
    const _DWT_Reconnect = Dynamsoft.DWT_Reconnect;
    Dynamsoft.DWT_Reconnect = (...args) =>
      _DWT_Reconnect.call({ Dynamsoft }, ...args);
    const __show_install_dialog = Dynamsoft._show_install_dialog;
    Dynamsoft._show_install_dialog = (...args) => {
      __show_install_dialog.call({ Dynamsoft }, ...args);
    };
    const _OnWebTwainOldPluginNotAllowedCallback =
      Dynamsoft.OnWebTwainOldPluginNotAllowedCallback;
    Dynamsoft.OnWebTwainOldPluginNotAllowedCallback = (...args) =>
      _OnWebTwainOldPluginNotAllowedCallback.call({ Dynamsoft }, ...args);
    const _OnWebTwainNeedUpgradeCallback =
      Dynamsoft.OnWebTwainNeedUpgradeCallback;
    Dynamsoft.OnWebTwainNeedUpgradeCallback = (...args) =>
      _OnWebTwainNeedUpgradeCallback.call({ Dynamsoft }, ...args);
    const _OnWebTwainPostExecuteCallback =
      Dynamsoft.OnWebTwainPostExecuteCallback;
    Dynamsoft.OnWebTwainPostExecuteCallback = (...args) =>
      _OnWebTwainPostExecuteCallback.call({ Dynamsoft }, ...args);
    const _OnRemoteWebTwainNotFoundCallback =
      Dynamsoft.OnRemoteWebTwainNotFoundCallback;
    Dynamsoft.OnRemoteWebTwainNotFoundCallback = (...args) =>
      _OnRemoteWebTwainNotFoundCallback.call({ Dynamsoft }, ...args);
    const _OnRemoteWebTwainNeedUpgradeCallback =
      Dynamsoft.OnRemoteWebTwainNeedUpgradeCallback;
    Dynamsoft.OnRemoteWebTwainNeedUpgradeCallback = (...args) =>
      _OnRemoteWebTwainNeedUpgradeCallback.call({ Dynamsoft }, ...args);
    const _OnWebTWAINDllDownloadFailure =
      Dynamsoft.OnWebTWAINDllDownloadFailure;
    Dynamsoft.OnWebTWAINDllDownloadFailure = (...args) =>
      _OnWebTWAINDllDownloadFailure.call({ Dynamsoft }, ...args);
  }

  componentDidMount() {
    const _this = this;
    Dynamsoft.Ready(function () {
      if (!Dynamsoft.Lib.env.bWin || !Dynamsoft.Lib.product.bHTML5Edition) {
        _this.initialStatus = 0;
      }
      if (_this.DWObject === null) _this.loadDWT(true);
    });
  }

  loadDWT(UseService: boolean) {
    Dynamsoft.DWT.ResourcesPath = '/dwt-resources';
    Dynamsoft.DWT.ProductKey = '101749047';
    const innerLoad = () => {
      this.innerLoadDWT(UseService).then(
        (_DWObject) => {
          this.DWObject = _DWObject;
          if (
            this.DWObject &&
            this.DWObject.Viewer.bind(document.getElementById(this.containerId))
          ) {
            this.DWObject.Viewer.width = this.width;
            this.DWObject.Viewer.height = this.height;
            this.DWObject.Viewer.setViewMode(1, 1);
            this.DWObject?.Viewer.show();
            this.setState({
              dwt: this.DWObject,
            });
            /**
             * NOTE: RemoveAll doesn't trigger bitmapchanged nor OnTopImageInTheViewChanged!!
             */
            this.DWObject?.RegisterEvent(
              'OnBitmapChanged',
              (changedIndex, changeType) =>
                this.handleBufferChange(changedIndex, changeType)
            );
            this.DWObject?.Viewer.on(
              'topPageChanged',
              (index, bByScrollBar) => {
                if (bByScrollBar || this.DWObject?.isUsingActiveX()) {
                  this.go(index);
                }
              }
            );
            this.DWObject?.RegisterEvent('OnPostTransfer', () =>
              this.handleBufferChange()
            );
            this.DWObject?.RegisterEvent('OnPostLoad', () =>
              this.handleBufferChange()
            );
            this.DWObject?.RegisterEvent('OnBufferChanged', (e) => {
              if (e.action === 'shift' && e.currentId !== -1) {
                this.handleBufferChange();
              }
            });
            this.DWObject?.RegisterEvent('OnPostAllTransfers', () =>
              this.DWObject?.CloseSource()
            );
            this.DWObject?.Viewer.on('click', () => {
              this.handleBufferChange();
            });
            if (this.DWObject && Dynamsoft.Lib.env.bWin)
              this.DWObject.MouseShape = false;
            this.handleBufferChange();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    };
    /**
     * ConnectToTheService is overwritten here for smoother install process.
     */
    Dynamsoft.DWT.ConnectToTheService = () => {
      innerLoad();
    };
    innerLoad();
  }

  innerLoadDWT(UseService: boolean) {
    // $FlowFixMe
    return new Promise((res, rej) => {
      if (UseService !== undefined) Dynamsoft.DWT.UseLocalService = UseService;
      this.modulizeInstallJS();
      const dwtInitialConfig = {
        WebTwainId: Math.random().toString(),
      };
      Dynamsoft.DWT.CreateDWTObjectEx(
        dwtInitialConfig,
        (_DWObject) => {
          res(_DWObject);
        },
        (errorString) => {
          rej(errorString);
        }
      );
    });
  }

  go(index: number) {
    // $FlowFixMe
    this.DWObject.CurrentImageIndexInBuffer = index;
    this.handleBufferChange();
  }

  handleBufferChange(changedIndex?: number, changeType?: number) {
    let _updated = false;
    if (changeType === 4) {
      // Modified
      _updated = true;
    }

    this.setState(
      {
        buffer: {
          updated: _updated,
          current: this.DWObject?.CurrentImageIndexInBuffer,
          count: this.DWObject?.HowManyImagesInBuffer,
        },
      },
      () => {
        if (this.state.buffer.count > 0) {
          this.setState({
            runtimeInfo: {
              curImageTimeStamp: new Date().getTime(),
              showAbleWidth:
                // $FlowFixMe
                this.DWObject.HowManyImagesInBuffer > 1
                  ? this.width - 16
                  : this.width,
              showAbleHeight: this.height,
              ImageWidth: this.DWObject?.GetImageWidth(
                this.state.buffer.current
              ),
              ImageHeight: this.DWObject?.GetImageHeight(
                this.state.buffer.current
              ),
            },
          });
        }
        this.props.onBufferChange(this.state.buffer.count);
      }
    );
  }

  handleViewerSizeChange(viewSize: Object) {
    this.width = viewSize.width;
    this.height = viewSize.height;
  }

  render() {
    return (
      <div>
        <DWTUserInterface
          Dynamsoft={Dynamsoft}
          containerId={this.containerId}
          startTime={this.state.startTime}
          dwt={this.state.dwt}
          status={this.state.status}
          buffer={this.state.buffer}
          runtimeInfo={this.state.runtimeInfo}
          handleViewerSizeChange={(viewSize) =>
            this.handleViewerSizeChange(viewSize)
          }
          handleBufferChange={() => this.handleBufferChange()}
          onSave={this.props.onSave}
          onError={this.props.onError}
          DWTControllerRef={this.props.DWTControllerRef}
          hideFilenameInput={this.props.hideFilenameInput}
        />
      </div>
    );
  }
}

export default forwardRef<Props, Object>((props, ref) => (
  <DWT DWTControllerRef={ref} {...props} />
));
