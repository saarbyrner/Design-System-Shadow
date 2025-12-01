/* eslint-disable no-alert */
// @flow
/* eslint-disable jsx-a11y/tabindex-no-positive, no-bitwise, react/sort-comp, max-statements, no-underscore-dangle, consistent-return */
import React from 'react';
import {
  Accordion,
  Checkbox,
  InputTextField,
  Select,
  TextButton,
} from '@kitman/components';
import { Alert } from '@kitman/playbook/components';

type Props = {
  Dynamsoft: Object,
  dwt: Object,
  buffer: Object,
  handleOutPutMessage: Function,
  handleException: Function,
  onSave: Function,
  hideFilenameInput?: boolean,
};

type State = {
  shownTabs: number,
  scanners: string[],
  deviceSetup: {
    currentScanner: string,
    bShowUI: boolean,
    bADF: boolean,
    bDuplex: boolean,
    nPixelType: '0' | '1' | '2',
    nResolution: '100' | '200' | '300' | '600',
    noUI?: boolean,
  },
  saveFileName: string,
  saveFileFormat: string,
};

/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {number} startTime the time when initializing started
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image
 * @prop {function} handleOutPutMessage a function to call a message needs to be printed out
 * @prop {function} handleException a function to handle exceptions
 */

const desiredDefaultDPI = '200';

export default class DWTController extends React.Component<Props, State> {
  handleException: Function;

  constructor(props: Props) {
    super(props);

    const defaultDeviceSetup = {
      currentScanner: 'noscanner',
      bShowUI: false,
      bADF: false,
      bDuplex: false,
      nPixelType: '0',
      nResolution: desiredDefaultDPI,
    };

    const storedSetup = JSON.parse(
      window.localStorage.getItem('DWT_scannerSetup')
    );

    this.state = {
      shownTabs: this.initialShownTabs,
      scanners: [],
      // Regardless of what is saved for nResolution use the desiredDefaultDPI
      deviceSetup: storedSetup
        ? { ...storedSetup, nResolution: desiredDefaultDPI }
        : defaultDeviceSetup,
      saveFileName: new Date().getTime().toString(),
      saveFileFormat: 'pdf',
    };
  }

  initialShownTabs = 121;

  Dynamsoft = this.props.Dynamsoft;

  DWObject = null;

  handleTabs(controlindex: number) {
    if (this.state.shownTabs & controlindex) {
      // close a Tab
      this.setState({ shownTabs: this.state.shownTabs - controlindex });
    } else {
      // Open a tab
      let _tabToShown = this.state.shownTabs;
      if (controlindex & 7) _tabToShown &= ~7;
      if (controlindex & 24) _tabToShown &= ~24;
      this.setState({ shownTabs: _tabToShown + controlindex });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.dwt !== prevProps.dwt) {
      this.DWObject = this.props.dwt;
      if (this.DWObject) {
        this.DWObject.GetDevicesAsync()
          .then((devices) => {
            const sourceNames = [];
            for (let i = 0; i < devices.length; i++) {
              // Get how many sources are installed in the system
              sourceNames.push(devices[i].displayName);
            }

            this.setState({ scanners: sourceNames });
            if (sourceNames.length > 0) this.onSourceChange(sourceNames[0]);
          })
          .catch((exp) => {
            alert(exp.message);
          });
      }
    }
  }

  // Tab 1: Scanner
  onSourceChange(value: string) {
    let oldDeviceSetup = this.state.deviceSetup;
    oldDeviceSetup.currentScanner = value;
    this.setState({
      deviceSetup: oldDeviceSetup,
    });
    if (value === 'noscanner') return;
    if (this.Dynamsoft.Lib.env.bMac) {
      if (value.indexOf('ICA') === 0) {
        oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.noUI = true;
        this.setState({
          deviceSetup: oldDeviceSetup,
        });
      } else {
        oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.noUI = false;
        this.setState({
          deviceSetup: oldDeviceSetup,
        });
      }
    }
  }

  onScannerSetupChange(option: string, value: any) {
    const oldDeviceSetup = this.state.deviceSetup;
    switch (option) {
      case 'bShowUI':
        oldDeviceSetup.bShowUI = value;
        break;
      case 'bADF':
        oldDeviceSetup.bADF = value;
        break;
      case 'bDuplex':
        oldDeviceSetup.bDuplex = value;
        break;
      case 'nPixelType':
        oldDeviceSetup.nPixelType = value;
        break;
      case 'nResolution':
        oldDeviceSetup.nResolution = value;
        break;
      default:
        break;
    }
    // Regardless of what they pick for nResolution save the desiredDefaultDPI
    window.localStorage.setItem(
      'DWT_scannerSetup',
      JSON.stringify({ ...oldDeviceSetup, nResolution: desiredDefaultDPI })
    );
    this.setState({
      deviceSetup: oldDeviceSetup,
    });
  }

  acquireImage() {
    this.DWObject?.GetDevicesAsync()
      .then((devices) => {
        for (let i = 0; i < devices.length; i++) {
          // Get how many sources are installed in the system
          if (
            devices[i].displayName === this.state.deviceSetup.currentScanner
          ) {
            return devices[i];
          }
        }
      })
      .then((device) => {
        return this.DWObject?.SelectDeviceAsync(device);
      })
      .then(() => {
        return this.DWObject?.AcquireImageAsync({
          IfShowUI: this.state.deviceSetup.bShowUI,
          PixelType: this.state.deviceSetup.nPixelType,
          Resolution: this.state.deviceSetup.nResolution,
          IfFeederEnabled: this.state.deviceSetup.bADF,
          IfDuplexEnabled: this.state.deviceSetup.bDuplex,
          IfDisableSourceAfterAcquire: true,
          IfGetImageInfo: true,
          IfGetExtImageInfo: true,
          extendedImageInfoQueryLevel: 0,
          /**
           * NOTE: No errors are being logged!!
           */
        });
      })
      .then(() => {
        return this.DWObject?.CloseSourceAsync();
      })
      .then(() => {
        this.props.handleOutPutMessage('Acquire success!', 'important');
      })
      .catch((exp) => {
        this.props.handleOutPutMessage('Acquire failure!', 'error');
        alert(exp.message);
      });
  }

  // Tab 3: Load
  loadImagesOrPDFs() {
    // $FlowFixMe
    this.DWObject.IfShowFileDialog = true;
    this.DWObject?.Addon.PDF.SetResolution(200);
    this.DWObject?.Addon.PDF.SetConvertMode(
      1 /* this.Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL */
    );
    this.DWObject?.LoadImageEx(
      '',
      5 /* this.Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL */,
      () => {
        this.props.handleOutPutMessage('Loaded an image successfully.');
      },
      (errorCode, errorString) =>
        this.props.handleException({ code: errorCode, message: errorString })
    );
  }

  // Tab 4: Save & Upload
  handleFileNameChange(event: Object) {
    this.setState({ saveFileName: event.target.value });
  }

  saveOrUploadImage() {
    const imagesToUpload = [];
    const fileName = `${this.state.saveFileName}.${this.state.saveFileFormat}`;

    const onSuccess = () => {
      this.setState({
        saveFileName: new Date().getTime().toString(),
      });
      this.props.handleOutPutMessage(
        `${fileName} saved successfully!`,
        'important'
      );
    };

    const onFailure = (errorCode, errorString) => {
      this.props.handleException({ code: errorCode, message: errorString });
    };

    for (let i = 0; i < this.props.buffer.count; i++) imagesToUpload.push(i);

    this.DWObject?.ConvertToBlob(
      imagesToUpload,
      this.Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF,
      (result) => {
        this.props.onSave(
          new File([result], fileName, { type: 'application/pdf' })
        );
        onSuccess();
      },
      onFailure
    );
  }

  render() {
    return (
      <div className="DWTController">
        <ul className="PCollapse">
          <li>
            <Accordion
              title="Custom Scan"
              content={
                <ul className="DWT__accordionContent DWT__scanSettings">
                  <li>
                    <Select
                      label="Device"
                      tabIndex="1"
                      value={this.state.deviceSetup.currentScanner}
                      onChange={(value) => this.onSourceChange(value)}
                      options={
                        this.state.scanners.length > 0
                          ? this.state.scanners.map((_name) => ({
                              label: _name,
                              value: _name,
                            }))
                          : [
                              {
                                label: 'Looking for devices..',
                                value: 'noscanner',
                              },
                            ]
                      }
                    />
                  </li>
                  <li>
                    <div className="DWT__labelContainer">
                      <span className="DWT__label">Device Setup</span>
                    </div>
                    <ul>
                      <li>
                        {this.state.deviceSetup.noUI ? (
                          ''
                        ) : (
                          <Checkbox
                            id="bShowUI"
                            label="Show UI"
                            isChecked={this.state.deviceSetup.bShowUI}
                            toggle={(checkbox) => {
                              this.onScannerSetupChange(
                                'bShowUI',
                                checkbox.checked
                              );
                            }}
                            kitmanDesignSystem
                            tabIndex="1"
                          />
                        )}

                        <Checkbox
                          id="bADF"
                          label="Page Feeder"
                          isChecked={this.state.deviceSetup.bADF}
                          toggle={(checkbox) => {
                            this.onScannerSetupChange('bADF', checkbox.checked);
                          }}
                          kitmanDesignSystem
                          tabIndex="1"
                        />

                        <Checkbox
                          id="bADF"
                          label="Duplex"
                          isChecked={this.state.deviceSetup.bDuplex}
                          toggle={(checkbox) => {
                            this.onScannerSetupChange(
                              'bDuplex',
                              checkbox.checked
                            );
                          }}
                          kitmanDesignSystem
                          tabIndex="1"
                        />
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Select
                      label="Pixel Type"
                      tabIndex="1"
                      value={this.state.deviceSetup.nPixelType}
                      onChange={(value) =>
                        this.onScannerSetupChange('nPixelType', value)
                      }
                      options={[
                        {
                          label: 'B&W',
                          value: '0',
                        },
                        {
                          label: 'Gray',
                          value: '1',
                        },
                        {
                          label: 'Color',
                          value: '2',
                        },
                      ]}
                    />
                  </li>
                  <li>
                    <Select
                      label="Resolution"
                      tabIndex="1"
                      value={this.state.deviceSetup.nResolution}
                      onChange={(value) =>
                        this.onScannerSetupChange('nResolution', value)
                      }
                      options={[
                        {
                          label: '100 DPI',
                          value: '100',
                        },
                        {
                          label: '200 DPI',
                          value: '200',
                        },
                        {
                          label: '300 DPI',
                          value: '300',
                        },
                        {
                          label: '600 DPI',
                          value: '600',
                        },
                      ]}
                    />
                    {this.state.deviceSetup.nResolution &&
                      parseInt(this.state.deviceSetup.nResolution, 10) >
                        parseInt(desiredDefaultDPI, 10) && (
                        <Alert
                          severity="info"
                          sx={{ backgroundColor: 'transparent' }}
                        >
                          Higher DPI increases processing time and file size. A
                          200 DPI setting is recommended.
                        </Alert>
                      )}
                  </li>
                  <li className="DWT__scanButton">
                    <TextButton
                      text="Scan"
                      onClick={() => this.acquireImage()}
                      type="secondary"
                      kitmanDesignSystem
                      isDisabled={this.state.scanners.length === 0}
                      tabIndex="1"
                    />
                  </li>
                </ul>
              }
              onChange={() => {
                this.handleTabs(1);
              }}
              isOpen={Boolean(this.state.shownTabs & 1)}
            />
          </li>
          <li>
            <Accordion
              title="Load Images"
              content={
                <div>
                  <Alert
                    severity="info"
                    sx={{ backgroundColor: 'transparent' }}
                  >
                    BMP, JPEG, TIFF, PNG files
                  </Alert>
                  <div className="DWT__accordionContent DWT__loadButton">
                    <TextButton
                      text="Load"
                      onClick={() => this.loadImagesOrPDFs()}
                      type="secondary"
                      kitmanDesignSystem
                      tabIndex="3"
                    />
                  </div>
                </div>
              }
              onChange={() => {
                this.handleTabs(4);
              }}
              isOpen={Boolean(this.state.shownTabs & 4)}
            />
          </li>
          {!this.props.hideFilenameInput && (
            <li>
              <Accordion
                title="Save Documents"
                content={
                  <div className="DWT__accordionContent">
                    <InputTextField
                      label="File Name :"
                      tabIndex="4"
                      value={this.state.saveFileName}
                      onChange={(e) => this.handleFileNameChange(e)}
                      kitmanDesignSystem
                    />
                  </div>
                }
                onChange={() => {
                  this.handleTabs(8);
                }}
                isOpen={Boolean(this.state.shownTabs & 8)}
              />
            </li>
          )}
        </ul>
      </div>
    );
  }
}
