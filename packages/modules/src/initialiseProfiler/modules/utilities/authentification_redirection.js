// @flow

import { sentryIgnorePrefix } from '@kitman/common/src/consts/services';
import {
  retrieveAndSaveRequestIdJQuery,
  handleError,
} from '@kitman/common/src/utils/services';
import type { JqXhr } from '@kitman/modules/src/initialiseProfiler/modules/utilities/types';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';

// Jquery is imported in another file so letting Flow know this
declare var $: any;

export const defaultSetup = {
  cache: false,
  statusCode: {
    // If the user is not authenticated, we redirect them to the login page
    '401': () => {
      // Do not redirect to the local back end if a URL to a custom one has
      // been supplied.
      if (isConnectedToStaging) return;

      const LOGIN_PATH = '/auth/sign_in';

      // In development mode, when the redirection happens within @kitman/profiler,
      // We strip out the port (3000) to redirect to the Rails application.
      if (
        process.env.NODE_ENV === 'development' &&
        window.location.port === '3002'
      ) {
        window.location.href = `http://${window.location.hostname}:8081${LOGIN_PATH}`;
      } else {
        window.location.href = LOGIN_PATH;
      }
    },
    '404': (jqXhr: JqXhr) => {
      handleError(
        jqXhr,
        'fullScreenGlobalError',
        'A 404 has occurred',
        jqXhr.status
      );
    },
    '422': (jqXhr: JqXhr) => {
      handleError(jqXhr, 'toastErrorUi', 'A 422 has occurred', jqXhr.status);
    },
    // '500': (jqXhr: JqXhr) => {
    //   handleError(
    //     jqXhr,
    //     'fullScreenGlobalError',
    //     'A 500 has occurred',
    //     jqXhr.status
    //   );
    // },
  },
};

export default () => {
  // Global jQuery AJAX Configuration
  if (window.featureFlags && window.featureFlags['updated-error-screen']) {
    $.ajaxSetup({
      // Read about this `error` field: https://cypressnorth.com/web-programming-and-development/global-ajax-error-handling-with-jquery
      error: (jqXhr) => {
        if (jqXhr.statusText !== 'abort') {
          retrieveAndSaveRequestIdJQuery(jqXhr);
          throw new Error(sentryIgnorePrefix + jqXhr.statusText);
        }
      },
      ...defaultSetup,
    });
  } else {
    $.ajaxSetup({ ...defaultSetup });
  }
};
