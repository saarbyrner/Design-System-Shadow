// @flow

import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { AxiosResponse } from 'axios';

setI18n(i18n);

/**
 * handleError
 * @param {Object} error - The error object caught in the catch block containing the standardized error response from BE.
 * @param {Function} onAttemptHandleError - Callback to determine if error can be handled error by component.
 * @param {Object} dataToPassToCallBack - Data within component that can be used within the callback (component -> hook -> component error handler)
 *
 * Does not return a value, all errors passed here and then callback called for each error and this returns a boolean to indicate if it was handled.
 * If not handled, a global event will be dispatched with error details to trigger the AsyncErrorBoundary.
 */

export type ErrorDetailType = {
  key: string,
  message: string,
  type: string,
};

type EventDetail = {
  errorList: Array<ErrorDetailType>,
  errorType: string,
  requestId: string,
};

type ErrorCountType = {
  total: number,
  current: number,
};

type ErrorMetaDataType = {
  errorCount: ErrorCountType,
  code: string,
};

const handleError = (
  error: AxiosResponse,
  onAttemptHandleError: (ErrorDetailType, ErrorMetaDataType, Object) => boolean, // False = error cannot be handled in component; escalate to global error screen
  dataToPassToCallBack?: Object // Data within component needed for callback logic
): void => {
  if (!error) return;

  const responseCode =
    error.responseJSON?.meta_data?.request_id ||
    i18n.t('No request id available');

  // ** Error response structure **
  // error.responseJSON.data => array of error objects
  // error.responseJSON.meta_data.request_id => request id

  const errorList =
    error.responseJSON &&
    error.responseJSON.data &&
    Array.isArray(error.responseJSON.data)
      ? error.responseJSON.data
      : [];

  const unHandledErrors = [];

  errorList.forEach((errorDetail, i) => {
    const errorMetaData = {
      errorCount: { total: errorList.length, current: i + 1 },
      code: responseCode,
    };

    // Pass current error in array to components callback to determine if it can handle it
    const wasHandled = onAttemptHandleError(
      errorDetail,
      errorMetaData,
      dataToPassToCallBack
    );

    // Fallback on global error screen if error not handled
    if (!wasHandled) {
      unHandledErrors.push(errorDetail);
    }
  });

  // Prepare data to pass (and trigger) the error screen if there are unhandled errors
  if (unHandledErrors.length) {
    const eventDetail: EventDetail = {
      errorList: unHandledErrors,
      errorType: 'fullScreenGlobalError',
      requestId: responseCode,
    };

    const event = new CustomEvent('globalError', { detail: eventDetail });
    window.dispatchEvent(event);
  }
};

export default handleError;
