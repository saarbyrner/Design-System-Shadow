// @flow

import { useState, useEffect, useRef, useReducer } from 'react';
import axios from 'axios';

import {
  getDymoPrintersFromXml,
  dymoRequestBuilder,
} from '@kitman/common/src/utils/DymoLabelPrinting/dymoPrinterUtils';

type Props = {
  port?: number,
  skip: boolean,
};

const useData = (initialData: Object): Object => {
  return useReducer(
    (prevState: Object, nextState: Object) => ({ ...prevState, ...nextState }),
    initialData
  );
};

export function useDymoCheckService({ port, skip }: Props) {
  const [status, setStatus] = useState('initial');
  const tokenSource = useRef();

  useEffect(() => {
    if (skip) {
      return;
    }

    if (tokenSource.current) {
      tokenSource.current.cancel();
    }
    tokenSource.current = axios.CancelToken.source();
    setStatus('loading');
    dymoRequestBuilder({
      method: 'GET',
      wsAction: 'status',
      cancelToken: tokenSource.current?.token,
    })
      .then(() => {
        tokenSource.current = null;
        setStatus('success');
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setStatus('error');
        }
      });

    // eslint-disable-next-line consistent-return
    return () => {
      if (tokenSource.current) {
        tokenSource.current.cancel();
      }
    };
  }, [skip, port]);

  return status;
}

export function useDymoFetchPrinters(
  statusDymoService?: string,
  modelPrinter?: string = 'LabelWriterPrinter',
  port?: number
) {
  const [data, setData] = useData({
    statusFetchPrinters: 'initial',
    printers: [],
    error: null,
  });
  const tokenSource = useRef();

  useEffect(() => {
    if (statusDymoService === 'success') {
      if (tokenSource.current) {
        tokenSource.current.cancel();
      }
      tokenSource.current = axios.CancelToken.source();
      setData({ statusFetchPrinters: 'loading' });

      dymoRequestBuilder({
        method: 'GET',
        wsAction: 'getPrinters',
        cancelToken: tokenSource.current?.token,
      })
        .then((response) => {
          tokenSource.current = null;
          setData({
            statusFetchPrinters: 'success',
            printers: getDymoPrintersFromXml(response.data, modelPrinter),
            error: null,
          });
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            setData({
              statusFetchPrinters: 'error',
              printers: [],
              error,
            });
          }
        });
    }
    return () => {
      if (tokenSource.current) {
        tokenSource.current.cancel();
      }
    };
  }, [modelPrinter, port, setData, statusDymoService]);

  return data;
}
