/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-labels */
/* eslint-disable no-extra-label */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */

// @flow
import axios from 'axios';

import DymoPrinterXMLParser from './dymoPrinterXMLParser';

import {
  WS_PROTOCOL,
  WS_SVC_HOST,
  WS_SVC_HOST_LEGACY,
  WS_START_PORT,
  WS_END_PORT,
  WS_SVC_PATH,
  WS_ACTIONS,
} from './dymoPrinterConstants';

import { localRetrieve, localStore } from './dymoPrinterStorage';

async function storeDymoRequestParams() {
  let activeRequestHost;
  let activeRequestPort;
  if (localRetrieve('dymo-ws-request-params')) {
    activeRequestHost = localRetrieve('dymo-ws-request-params').activeHost;
    activeRequestPort = localRetrieve('dymo-ws-request-params').activePort;
    window.localStorage.removeItem('dymo-ws-request-params');
  }
  const hostList = [WS_SVC_HOST, WS_SVC_HOST_LEGACY];
  loop1: for (
    let currentHostIndex = 0;
    currentHostIndex < hostList.length;
    currentHostIndex++
  ) {
    loop2: for (
      let currentPort = WS_START_PORT;
      currentPort <= WS_END_PORT;
      currentPort++
    ) {
      if (
        activeRequestPort &&
        hostList[currentHostIndex] === activeRequestHost &&
        currentPort === Number.parseInt(activeRequestPort)
      ) {
        continue loop2;
      }
      try {
        const response = await axios.get(
          dymoUrlBuilder(
            WS_PROTOCOL,
            hostList[currentHostIndex],
            currentPort,
            WS_SVC_PATH,
            'status'
          )
        );
        const [successRequestHost, successRequestPort] = response.config.url
          .split('/')[2]
          .split(':');
        localStore('dymo-ws-request-params', {
          activeHost: successRequestHost,
          activePort: successRequestPort,
        });
        break loop1;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export async function dymoRequestBuilder({
  wsProtocol = WS_PROTOCOL,
  wsPath = WS_SVC_PATH,
  wsAction,
  method,
  cancelToken,
  axiosOtherParams = {},
}: {
  wsProtocol?: string,
  wsPath?: string,
  wsAction: string,
  method: string,
  cancelToken?: string,
  axiosOtherParams?: Object,
}) {
  if (!localRetrieve('dymo-ws-request-params')) {
    await storeDymoRequestParams();
  }
  const { activeHost, activePort } = localRetrieve('dymo-ws-request-params');

  const dymoAxiosInstance = axios.create();
  dymoAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isCancel(error) || error?.response?.status === 500) {
        return Promise.reject(error);
      }
      await storeDymoRequestParams();
      if (!localRetrieve('dymo-ws-request-params')) {
        return Promise.reject(error);
      }
      try {
        const response = await axios.request({
          url: dymoUrlBuilder(
            wsProtocol,
            activeHost,
            activePort,
            wsPath,
            wsAction
          ),
          method,
          cancelToken,
          ...axiosOtherParams,
        });
        return Promise.resolve(response);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  );
  const request = await dymoAxiosInstance.request({
    url: dymoUrlBuilder(wsProtocol, activeHost, activePort, wsPath, wsAction),
    method,
    cancelToken,
    ...axiosOtherParams,
  });
  return request;
}

export function dymoUrlBuilder(
  wsProtocol: string,
  wsHost: string,
  wsPort: number,
  wsPath: string,
  wsAction: string
) {
  return `${wsProtocol}${wsHost}:${wsPort}/${wsPath}/${WS_ACTIONS[wsAction]}`;
}

export function getDymoPrintersFromXml(xml: string, modelPrinter: string) {
  const xmlParse = new DymoPrinterXMLParser().parseFromString(xml);
  const labelWritersPrinters = xmlParse.getElementsByTagName(modelPrinter);
  const printers = [];
  labelWritersPrinters.forEach((printer: Object) => {
    const printerDetails = {};
    printer.children.forEach((item) => {
      printerDetails[item.name.charAt(0).toLowerCase() + item.name.slice(1)] =
        item.value;
    });
    printers.push(printerDetails);
  });
  return printers;
}

/**
 * Print dymo labels
 *
 * @param {string} printerName - The Dymo Printer to print on
 * @param {string} labelXml - Label XML parsed to string
 * @param {string} labelSetXml - LabelSet to print. LabelSet is used to print multiple labels with same layout but different data, e.g. multiple addresses.
 * @returns AxiosResponse
 *
 */
export function printLabel(
  printerName: string,
  labelXml: string,
  labelSetXml?: string
) {
  return dymoRequestBuilder({
    method: 'POST',
    wsAction: 'printLabel',
    axiosOtherParams: {
      data: `printerName=${encodeURIComponent(
        printerName
      )}&printParamsXml=&labelXml=${encodeURIComponent(labelXml)}&labelSetXml=${
        labelSetXml || ''
      }`,
    },
  });
}
