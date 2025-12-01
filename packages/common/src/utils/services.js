/* eslint-disable no-param-reassign */
/* eslint-disable max-depth */
// @flow

// All service-related utils. In this context, a service is strictly a $.ajax or
// axios.[get|post|put|patch|delete] wrapper.

import { type JQuery } from 'jquery';
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

import {
  requestIdLocalStorageKey,
  sentryIgnorePrefix,
} from '@kitman/common/src/consts/services';
import getCookie from '@kitman/common/src/utils/getCookie';
import {
  getObjectWithKeysInCamelCase,
  getObjectWithKeysInSnakeCase,
} from '@kitman/common/src/utils/objectKeysTransformers';
import type { ErrorResponse } from '@kitman/modules/src/initialiseProfiler/modules/utilities/types';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import i18n from './i18n';

type ErrorObject = AxiosError<any> | JQuery.jqXHR<any>;

type ErrorEventDetail = {
  errorList: ?Array<ErrorObject>,
  errorType: string,
  requestId: ?string,
  genericMessage: string,
  rawResponse: ErrorObject,
  errorCode: number,
};
type ErrorDetailNoResponseObject = {
  errorType: string,
  errorCode: number,
};

export const handleError = (
  errorObject: ErrorObject,
  errorType: string,
  genericMessage: string,
  errorCode: number
) => {
  let response: ?ErrorResponse = null;

  if (errorObject && typeof errorObject === 'object') {
    if ('responseJSON' in errorObject && errorObject.responseJSON) {
      // This is a jQuery AJAX error
      response = errorObject.responseJSON;
    } else if (
      'response' in errorObject &&
      errorObject.response &&
      errorObject.response.data
    ) {
      // This is an Axios error
      response = errorObject.response.data;
    }
  }
  const requestId = response?.meta_data?.request_id;

  if (requestId) {
    if (response) {
      const errorEventDetail: ErrorEventDetail = {
        errorList: Array.isArray(response.data) ? response.data : undefined,
        errorType,
        requestId,
        genericMessage,
        rawResponse: response,
        errorCode,
      };

      const event = new CustomEvent('globalError', {
        detail: errorEventDetail,
      });
      window.dispatchEvent(event);
    } else {
      const errorEventDetailNoResponseObj: ErrorDetailNoResponseObject = {
        errorType,
        errorCode,
      };

      const errorEvent = new CustomEvent('globalError', {
        detail: errorEventDetailNoResponseObj,
      });
      window.dispatchEvent(errorEvent);
    }
  }
};

export const retrieveAndSaveRequestIdJQuery = (jqXhr: JQuery.jqXHR<any>) => {
  try {
    const requestId = jqXhr.getResponseHeader('X-Request-Id');
    if (requestId) {
      window.localStorage?.setItem(requestIdLocalStorageKey, requestId);
    }
    // eslint-disable-next-line no-empty
  } catch {}
};

export const getSavedRequestId = (): ?string => {
  return window.localStorage?.getItem(requestIdLocalStorageKey);
};

export const clearSavedRequestId = () => {
  window.localStorage?.removeItem?.(requestIdLocalStorageKey);
};

export const isCanceledError = (error: Object): boolean => {
  if (!error) return false;

  const isCanceled =
    error instanceof Error &&
    error.message === `${sentryIgnorePrefix}CanceledError: canceled`;
  const isAborted = error.statusText === 'abort';

  return isCanceled || isAborted;
};

export const axiosRequestInterceptor = <T: Object>(req: T): T => {
  if (req.isInCamelCase || req.data?.isInCamelCase) {
    if (req.data?.isInCamelCase) delete req.data.isInCamelCase;

    req.transformRequest.unshift(getObjectWithKeysInSnakeCase);
    // Our response transformer must go last, hence push.
    req.transformResponse.push(getObjectWithKeysInCamelCase);
  }

  if (req.data && 'isInCamelCase' in req.data) delete req.data.isInCamelCase;

  if (!req.headers) {
    req.headers = {};
  }
  req.headers['X-KITMAN-CSRF-TOKEN'] = getCookie('KITMAN-CSRF-TOKEN');

  return req;
};

export const axiosResponseErrorInterceptor = (error: Object) => {
  if (window.featureFlags && window.featureFlags['updated-error-screen']) {
    try {
      const { response } = error;
      if (response) {
        const requestId = response.headers['x-request-id'];
        if (requestId) {
          window.localStorage?.setItem(requestIdLocalStorageKey, requestId);
        }
      }
    } catch {
      const unknownError = `Unknown error for updated-error-screen flow: ${sentryIgnorePrefix}${error.message}`;
      throw new Error(unknownError);
    }
  }

  try {
    const { response } = error;
    if (response) {
      const status = response.status;

      if (status === statusCodes.notFound) {
        handleError(
          error,
          'fullScreenGlobalError',
          i18n.t('The requested resource was not found'),
          statusCodes.notFound
        );
        throw error;
      }
      if (status === statusCodes.unprocessableEntity) {
        handleError(
          error,
          'toastErrorUi',
          i18n.t(
            'Could not process your request. Contact support if problem persists.'
          ),
          statusCodes.unprocessableEntity
        );
        throw error;
      }
      throw error;
    }
  } catch (e) {
    throw e;
  }
  throw new Error(`${sentryIgnorePrefix}${error.message}`);
};

export const ajaxRequestInterceptor = (options: Object) => {
  let parsedData;
  try {
    parsedData = JSON.parse(options.data);
  } catch {
    // At the moment the feature isn’t critical. If the code above throws an
    // error, we catch it and do nothing to not disrupt other code in this
    // interceptor. In this case, the default flow will take place so response
    // and request values won’t be converted and will be left as is.
  }

  // isInCamelCase can arrive either as a part of request body or just as a
  // request option.
  if (parsedData?.isInCamelCase || options?.isInCamelCase) {
    let data;
    if (parsedData?.isInCamelCase) delete parsedData.isInCamelCase;
    const transformedData = getObjectWithKeysInSnakeCase(parsedData);
    try {
      data = JSON.stringify(transformedData);
    } catch {
      // At the moment the feature isn’t critical. If the code above throws
      // an error, we catch it and do nothing to not disrupt other code in
      // this interceptor. In this case, the default flow will take place so
      // response and request values won’t be converted and will be left as
      // is.
    }
    if (data) options.data = data;

    // Check for data ensures that if parsedData.isInCamelCase equals true,
    // isInCamelCase was successfully removed from the body. Otherwise, the logic
    // will default to unmodified requests and responses.
    if (data || options?.isInCamelCase) {
      const parse = options.converters['text json'];
      options.converters['text json'] = (text: string): Object => {
        return getObjectWithKeysInCamelCase(parse(text));
      };
    }
  }
  if (parsedData && 'isInCamelCase' in parsedData) {
    delete parsedData.isInCamelCase;
    // Not wrapped in try/catch because truthy parsedData, which is checked
    // in the wrapping if statement, means it’s a valid JSON, hence
    // strinfifiable.
    options.data = JSON.stringify(parsedData);
  }
  if (!options.headers) options.headers = {};
  options.headers['X-KITMAN-CSRF-TOKEN'] = getCookie('KITMAN-CSRF-TOKEN');
};

const axiosInstance: AxiosInstance = axios.create({
  timeout: 60000, // 60 seconds.
});

axiosInstance.interceptors.request.use(axiosRequestInterceptor, Promise.reject);

axiosInstance.interceptors.response.use(null, axiosResponseErrorInterceptor);
export { axiosInstance as axios };
