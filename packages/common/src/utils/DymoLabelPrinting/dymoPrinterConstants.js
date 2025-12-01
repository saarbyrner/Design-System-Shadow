// @flow

export const WS_PROTOCOL = 'https://';
export const WS_START_PORT = 41951;
export const WS_END_PORT = 41953;
export const WS_CHECK_TIMEOUT = 3e3;
export const WS_COMMAND_TIMEOUT = 1e4;
export const WS_SVC_HOST = '127.0.0.1';
export const WS_SVC_HOST_LEGACY = 'localhost';
export const WS_SVC_PATH = 'DYMO/DLS/Printing';
export const WS_ACTIONS = {
  status: 'StatusConnected',
  getPrinters: 'GetPrinters',
  openLabel: 'OpenLabelFile',
  printLabel: 'PrintLabel',
  printLabel2: 'PrintLabel2',
  renderLabel: 'RenderLabel',
  loadImage: 'LoadImageAsPngBase64',
  getJobStatus: 'GetJobStatus',
};
