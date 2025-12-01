/* eslint-disable jest/no-conditional-expect */
/* eslint-disable global-require */
import structuredClone from 'core-js/stable/structured-clone';

import {
  sentryIgnorePrefix,
  requestIdLocalStorageKey,
} from '@kitman/common/src/consts/services';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import { AxiosError } from 'axios';

import {
  axios,
  ajaxRequestInterceptor,
  axiosRequestInterceptor,
  axiosResponseErrorInterceptor,
  handleError,
  isCanceledError,
  retrieveAndSaveRequestIdJQuery
} from '../services';

jest.mock('@kitman/common/src/utils/getCookie', () =>
  jest.fn(() => 'test-csrf-token')
);

describe('services', () => {
  describe('isCanceledError()', () => {
    it.each([
      {
        description: 'statusText = abort',
        input: { statusText: 'abort' },
        expected: true,
      },
      {
        description: 'error.message = CanceledError: canceled',
        input: new Error(`${sentryIgnorePrefix}CanceledError: canceled`),
        expected: true,
      },
      {
        description: 'error = {}',
        input: {},
        expected: false,
      },
      {
        description: 'no error object passed',
        input: {},
        expected: false,
      },
      {
        description: 'error = { statusText: "OK" }',
        input: { statusText: 'OK' },
        expected: false,
      },
    ])('with $description', ({ input, expected }) =>
      expect(isCanceledError(input)).toEqual(expected)
    );
  });

  describe('ajaxRequestInterceptor()', () => {
    const handlesFalsyIsInCamelCaseInDataCorrectlyTest = {
      description: 'handles falsy isInCamelCase in data correctly',
      input: {
        headers: {},
        data: JSON.stringify({ in_snake_case: 1, isInCamelCase: false }),
      },
      expected: {
        headers: {
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
        data: '{"in_snake_case":1}',
      },
    };

    const tests = [
      {
        description: 'handles the default case correctly',
        input: {},
        expected: {
          headers: {
            'X-KITMAN-CSRF-TOKEN': 'omnomnom',
          },
        },
      },
      {
        description: 'handles the default case with data correctly',
        input: {
          headers: {},
          data: { inCamelCase: 1 },
        },
        expected: {
          headers: {
            'X-KITMAN-CSRF-TOKEN': 'omnomnom',
          },
          data: { inCamelCase: 1 },
        },
      },
      {
        description: 'handles truthy isInCamelCase in data correctly',
        input: {
          headers: {},
          data: JSON.stringify({ inCamelCase: 1, isInCamelCase: true }),
          converters: { 'text json': () => ({ in_snake_case: 1 }) },
        },
        expected: {
          headers: {
            'X-KITMAN-CSRF-TOKEN': 'omnomnom',
          },
          data: '{"in_camel_case":1}',
          converters: { 'text json': expect.any(Function) },
        },
        transformations: {
          request: '{"in_camel_case":1}',
          response: { inSnakeCase: 1 },
        },
      },
      structuredClone(handlesFalsyIsInCamelCaseInDataCorrectlyTest),
      {
        description: 'handles isInCamelCase in options correctly',
        input: {
          headers: {},
          data: JSON.stringify({ inCamelCase: 1 }),
          isInCamelCase: true,
          converters: { 'text json': () => ({ in_snake_case: 1 }) },
        },
        expected: {
          headers: {
            'X-KITMAN-CSRF-TOKEN': 'omnomnom',
          },
          data: '{"in_camel_case":1}',
          isInCamelCase: true,
          converters: { 'text json': expect.any(Function) },
        },
        transformations: {
          request: '{"in_camel_case":1}',
          response: { inSnakeCase: 1 },
        },
      },
    ];

    it.each(tests)('$description', ({ input, expected, transformations }) => {
      ajaxRequestInterceptor(input);
      expect(input).toEqual(expected);
      if (transformations) {
        expect(input.data).toEqual(transformations.request);
        expect(input.converters['text json'](input.data)).toEqual(
          transformations.response
        );
      }
    });
  });

  describe('handleError()', () => {
    let dispatchEventSpy;

    beforeEach(() => {
      dispatchEventSpy = jest
        .spyOn(window, 'dispatchEvent')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      dispatchEventSpy.mockRestore();
    });

    it('should dispatch a globalError event for AxiosError with a requestId', () => {
      const mockAxiosError = {
        response: {
          data: {
            data: [{ field: 'name', message: 'invalid' }],
            meta_data: { request_id: 'axios-123' },
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'An unexpected error has occurred';
      const errorCode = statusCodes.internalServerError;

      handleError(mockAxiosError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: [{ field: 'name', message: 'invalid' }],
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-123',
            genericMessage: 'An unexpected error has occurred',
            rawResponse: mockAxiosError.response.data,
            errorCode: statusCodes.internalServerError,
          },
        })
      );
    });

    it('should dispatch a globalError event for jQuery jqXHR with a requestId', () => {
      const mockJqueryError = {
        responseJSON: {
          data: [{ field: 'email', message: 'required' }],
          meta_data: { request_id: 'jquery-456' },
        },
      };
      const errorType = 'toastErrorUi';
      const genericMessage = 'Validation failed';
      const errorCode = statusCodes.unprocessableEntity;

      handleError(mockJqueryError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: [{ field: 'email', message: 'required' }],
            errorType: 'toastErrorUi',
            requestId: 'jquery-456',
            genericMessage: 'Validation failed',
            rawResponse: mockJqueryError.responseJSON,
            errorCode: statusCodes.unprocessableEntity,
          },
        })
      );
    });

    it('should NOT dispatch a globalError event if no requestId is found (meta_data is empty)', () => {
      const mockErrorWithoutRequestId = {
        response: {
          data: {
            data: [],
            meta_data: {},
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'Unknown error';
      const errorCode = statusCodes.internalServerError;

      handleError(
        mockErrorWithoutRequestId,
        errorType,
        genericMessage,
        errorCode
      );

      expect(dispatchEventSpy).not.toHaveBeenCalled(); // Nothing is dispatched if requestId is falsy
    });

    it('should NOT dispatch a globalError event if response structure is unexpected (no response data)', () => {
      const mockUnexpectedError = {
        someOtherProperty: 'value', // No 'response' or 'responseJSON'
      };
      const errorType = 'toastErrorUi';
      const genericMessage = 'Something went wrong';
      const errorCode = statusCodes.badRequest;

      handleError(mockUnexpectedError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).not.toHaveBeenCalled(); // Nothing is dispatched if response is not found/parsed
    });

    it('should handle null or undefined errorObject gracefully', () => {
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'Error occurred';
      const errorCode = statusCodes.internalServerError;

      handleError(null, errorType, genericMessage, errorCode);
      handleError(undefined, errorType, genericMessage, errorCode);

      // Expect no events to be dispatched as there's no valid error object to extract a requestId from
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });

    it('should NOT dispatch an event if response exists but requestId is null', () => {
      const mockErrorWithNullRequestId = {
        response: {
          data: {
            data: [],
            meta_data: { request_id: null }, // Explicitly null requestId
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'Error with null request ID';
      const errorCode = statusCodes.internalServerError;

      handleError(
        mockErrorWithNullRequestId,
        errorType,
        genericMessage,
        errorCode
      );

      expect(dispatchEventSpy).not.toHaveBeenCalled(); // Nothing is dispatched if requestId is falsy (null)
    });

    it('should NOT dispatch an event if response exists but requestId is an empty string', () => {
      const mockErrorWithEmptyRequestId = {
        response: {
          data: {
            data: [],
            meta_data: { request_id: '' }, // Explicitly empty string requestId
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'Error with empty request ID';
      const errorCode = statusCodes.internalServerError;

      handleError(
        mockErrorWithEmptyRequestId,
        errorType,
        genericMessage,
        errorCode
      );

      expect(dispatchEventSpy).not.toHaveBeenCalled(); // Nothing is dispatched if requestId is falsy (empty string)
    });

    it('should dispatch a globalError event for AxiosError with a 422 status code', () => {
      const mockAxiosError = {
        response: {
          status: 422,
          data: {
            data: [{ field: 'name', message: 'invalid' }],
            meta_data: { request_id: 'axios-422' },
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'An unexpected error has occurred';
      const errorCode = statusCodes.unprocessableEntity;

      handleError(mockAxiosError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: [{ field: 'name', message: 'invalid' }],
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-422',
            genericMessage: 'An unexpected error has occurred',
            rawResponse: mockAxiosError.response.data,
            errorCode: statusCodes.unprocessableEntity,
          },
        })
      );
    });

    it('should dispatch a globalError event when data.data is not an array', () => {
      const mockAxiosError = {
        response: {
          data: {
            data: { field: 'name', message: 'invalid' },
            meta_data: { request_id: 'axios-123' },
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'An unexpected error has occurred';
      const errorCode = statusCodes.internalServerError;

      handleError(mockAxiosError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: undefined,
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-123',
            genericMessage: 'An unexpected error has occurred',
            rawResponse: mockAxiosError.response.data,
            errorCode: statusCodes.internalServerError,
          },
        })
      );
    });

    it('should dispatch a globalError event when data.data contains a cause object', () => {
      const mockAxiosError = {
        response: {
          data: {
            data: [{ field: 'name', message: 'invalid', cause: 'some cause' }],
            meta_data: { request_id: 'axios-123' },
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'An unexpected error has occurred';
      const errorCode = statusCodes.internalServerError;

      handleError(mockAxiosError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: [
              { field: 'name', message: 'invalid', cause: 'some cause' },
            ],
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-123',
            genericMessage: 'An unexpected error has occurred',
            rawResponse: mockAxiosError.response.data,
            errorCode: statusCodes.internalServerError,
          },
        })
      );
    });

    it('should dispatch a globalError event when response.data is missing', () => {
      const mockAxiosError = {
        response: {
          data: {
            meta_data: { request_id: 'axios-missing-data' },
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'An unexpected error has occurred';
      const errorCode = statusCodes.internalServerError;

      handleError(mockAxiosError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: undefined,
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-missing-data',
            genericMessage: 'An unexpected error has occurred',
            rawResponse: mockAxiosError.response.data,
            errorCode: statusCodes.internalServerError,
          },
        })
      );
    });

    it('should dispatch a globalError event when data.data array is empty', () => {
      const mockAxiosError = {
        response: {
          data: {
            data: [],
            meta_data: { request_id: 'axios-empty-data' },
          },
        },
      };
      const errorType = 'fullScreenGlobalError';
      const genericMessage = 'An unexpected error has occurred';
      const errorCode = statusCodes.internalServerError;

      handleError(mockAxiosError, errorType, genericMessage, errorCode);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorList: [],
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-empty-data',
            genericMessage: 'An unexpected error has occurred',
            rawResponse: mockAxiosError.response.data,
            errorCode: statusCodes.internalServerError,
          },
        })
      );
    });
  });

  describe('axiosInstance with interceptors', () => {
    let localStorageMock;
    const originalAdapter = axios.defaults.adapter;

    beforeEach(() => {
      window.featureFlags = {};
      localStorageMock = {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
    });

    afterEach(() => {
      axios.defaults.adapter = originalAdapter;
    });

    it('should call localStorage.setItem and throw an error on response error when updated-error-screen is true', async () => {
      window.featureFlags['updated-error-screen'] = true;

      const config = { method: 'get', url: '/test' };
      const mockErrorResponse = {
        data: {
          message: 'Internal Server Error',
          meta_data: { request_id: 'axios-test-123' },
        },
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'x-request-id': 'axios-test-123' },
        config,
      };

      const error = new AxiosError(
        'Request failed with status code 500',
        'ERR_BAD_RESPONSE',
        config,
        {},
        mockErrorResponse
      );

      axios.defaults.adapter = jest.fn().mockRejectedValue(error);

      await expect(axios.get('/test')).rejects.toThrow(
        'Request failed with status code 500'
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        requestIdLocalStorageKey,
        'axios-test-123'
      );
    });

    it('should NOT call localStorage.setItem when updated-error-screen is false', async () => {
      window.featureFlags['updated-error-screen'] = false;

      const config = { method: 'get', url: '/test' };
      const mockErrorResponse = {
        data: {
          message: 'Internal Server Error',
          meta_data: { request_id: 'axios-test-123' },
        },
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'x-request-id': 'axios-test-123' },
        config,
      };

      const error = new AxiosError(
        'Request failed with status code 500',
        'ERR_BAD_RESPONSE',
        config,
        {},
        mockErrorResponse
      );

      axios.defaults.adapter = jest.fn().mockRejectedValue(error);

      await expect(axios.get('/test')).rejects.toThrow(
        'Request failed with status code 500'
      );
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should call handleError for a 404 error', async () => {
      const dispatchEventSpy = jest
        .spyOn(window, 'dispatchEvent')
        .mockImplementation(() => {});

      const config = { method: 'get', url: '/test-404' };
      const mockErrorResponse = {
        data: {
          message: 'Not Found',
          // handleError requires a request_id to dispatch an event
          meta_data: { request_id: 'axios-test-404' },
        },
        status: 404,
        statusText: 'Not Found',
        headers: { 'x-request-id': 'axios-test-404' },
        config,
      };

      const error = new AxiosError(
        'Request failed with status code 404',
        'ERR_BAD_RESPONSE',
        config,
        {},
        mockErrorResponse
      );

      axios.defaults.adapter = jest.fn().mockRejectedValue(error);

      // We expect the call to reject, and the interceptor to handle the error
      await expect(axios.get('/test-404')).rejects.toThrow(
        'Request failed with status code 404'
      );

      // Verify that our error handler's side effect (dispatching an event) occurred
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'globalError',
          detail: expect.objectContaining({
            errorType: 'fullScreenGlobalError',
            requestId: 'axios-test-404',
            errorCode: statusCodes.notFound,
          }),
        })
      );

      // Clean up the spy
      dispatchEventSpy.mockRestore();
    });

    it('should call handleError for a 422 error', async () => {
      const dispatchEventSpy = jest
        .spyOn(window, 'dispatchEvent')
        .mockImplementation(() => {});

      const config = { method: 'get', url: '/test-422' };
      const mockErrorResponse = {
        data: {
          message: 'Unprocessable Entity',
          meta_data: { request_id: 'axios-test-422' },
        },
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: { 'x-request-id': 'axios-test-422' },
        config,
      };

      const error = new AxiosError(
        'Request failed with status code 422',
        'ERR_BAD_RESPONSE',
        config,
        {},
        mockErrorResponse
      );

      axios.defaults.adapter = jest.fn().mockRejectedValue(error);

      await expect(axios.get('/test-422')).rejects.toThrow(
        'Request failed with status code 422'
      );

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'globalError',
          detail: expect.objectContaining({
            errorType: 'toastErrorUi',
            requestId: 'axios-test-422',
            errorCode: statusCodes.unprocessableEntity,
          }),
        })
      );

      dispatchEventSpy.mockRestore();
    });

    it('should re-throw a generic error if the error has no response object', async () => {
      const dispatchEventSpy = jest
        .spyOn(window, 'dispatchEvent')
        .mockImplementation(() => {});

      // Create an error without a `response` property to simulate a network error
      const networkError = new Error('Network Error');

      axios.defaults.adapter = jest
        .fn()
        .mockRejectedValue(networkError);

      // the generic error message from the interceptor
      await expect(axios.get('/test-network-error')).rejects.toThrow(
        'Sentry Ignore - Network Error'
      );

      // No event should be dispatched because handleError is not called
      expect(dispatchEventSpy).not.toHaveBeenCalled();

      dispatchEventSpy.mockRestore();
    });

    it('should re-throw the original error for unhandled status codes like 500', async () => {
      const dispatchEventSpy = jest
        .spyOn(window, 'dispatchEvent')
        .mockImplementation(() => {});

      const config = { method: 'get', url: '/test-500' };
      const mockErrorResponse = {
        data: { message: 'Internal Server Error' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'x-request-id': 'axios-test-500' },
        config,
      };

      const error = new AxiosError(
        'Request failed with status code 500',
        'ERR_BAD_RESPONSE',
        config,
        {},
        mockErrorResponse
      );

      axios.defaults.adapter = jest.fn().mockRejectedValue(error);

      // Expect the original error to be thrown, as the interceptor doesn't handle 500 specifically
      await expect(axios.get('/test-500')).rejects.toThrow(
        'Request failed with status code 500'
      );

      // handleError should not be called for a 500 error in the current logic
      expect(dispatchEventSpy).not.toHaveBeenCalled();

      dispatchEventSpy.mockRestore();
    });

    it('should return false when a null error is provided to isCanceledError', () => {
      expect(isCanceledError(null)).toBe(false);
    });

    it('should not dispatch an event if the response is missing the meta_data object', () => {
      const dispatchEventSpy = jest
        .spyOn(window, 'dispatchEvent')
        .mockImplementation(() => {});

      const mockError = {
        response: {
          data: {
            // No meta_data object at all
            data: [{ field: 'name', message: 'invalid' }],
          },
        },
      };

      handleError(mockError, 'fullScreenGlobalError', 'An error occurred', 500);

      expect(dispatchEventSpy).not.toHaveBeenCalled();

      dispatchEventSpy.mockRestore();
    });

    it('should add the CSRF token to the Axios request headers', () => {
      // 1. Reset the module cache to ensure we get a fresh import
      jest.resetModules();

      // 2. Mock the dependency to return our specific test token
      jest.mock('@kitman/common/src/utils/getCookie', () =>
        jest.fn(() => 'test-csrf-token')
      );

      // 3. Dynamically require the function *after* the mock is in place,
      //    and rename it to avoid the linting error.
      const {
        axiosRequestInterceptor: axiosRequestInterceptorWithMock,
      } = require('../services');

      const request = { headers: {} };
      const interceptedRequest = axiosRequestInterceptorWithMock(request);

      // 4. Assert the correct token was used
      expect(interceptedRequest.headers['X-KITMAN-CSRF-TOKEN']).toBe(
        'test-csrf-token'
      );
    });

    it('should add the CSRF token to the ajax request options', () => {
      jest.resetModules();
      jest.mock('@kitman/common/src/utils/getCookie', () =>
        jest.fn(() => 'ajax-csrf-token')
      );

      const {
        ajaxRequestInterceptor: ajaxRequestInterceptorWithMock,
      } = require('../services');

      const options = { headers: {} };
      ajaxRequestInterceptorWithMock(options);

      expect(options.headers['X-KITMAN-CSRF-TOKEN']).toBe('ajax-csrf-token');
    });

    it('should return false for an error object with no message property', () => {
      const errorWithoutMessage = { statusText: 'some-status' };
      expect(isCanceledError(errorWithoutMessage)).toBe(false);
    });

    it('should re-throw a generic error if a non-Axios error is passed to the response interceptor', () => {
      const genericError = new Error('Something unexpected happened');

      // The interceptor is a synchronous function that throws, so we test it directly.
      expect(() =>
        axiosResponseErrorInterceptor(genericError)
      ).toThrow(`${sentryIgnorePrefix}Something unexpected happened`);
    });

    it('should not dispatch an event when request_id is present but null', () => {
      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent').mockImplementation(() => {});
      
      const mockError = {
        response: {
          data: {
            meta_data: { request_id: null },
            data: [{ field: 'name', message: 'invalid' }],
          },
        },
      };

      handleError(mockError, 'fullScreenGlobalError', 'An error occurred', 500);

      expect(dispatchEventSpy).not.toHaveBeenCalled();
      
      dispatchEventSpy.mockRestore();
    });

    it('should not throw an error in ajaxRequestInterceptor if JSON data is malformed', () => {
      const options = {
        data: '{"inCamelCase":1, "isInCamelCase":true, malformed}', // Invalid JSON
        headers: {},
        converters: { 'text json': (text) => JSON.parse(text) },
      };

      // We expect the function to run without crashing
      expect(() => ajaxRequestInterceptor(options)).not.toThrow();
      
      // And the original malformed data should remain unchanged
      expect(options.data).toBe('{"inCamelCase":1, "isInCamelCase":true, malformed}');
    });

    it('should throw a generic error if the response object is null', () => {
      const errorWithNullResponse = new AxiosError('Request failed');
      errorWithNullResponse.response = null; // Explicitly set response to null

      expect(() => axiosResponseErrorInterceptor(errorWithNullResponse)).toThrow(
        `${sentryIgnorePrefix}Request failed`
      );
    });

    it('should not crash if getResponseHeader throws an error in retrieveAndSaveRequestIdJQuery', () => {
      const localStorage = { setItem: jest.fn() };
      Object.defineProperty(window, 'localStorage', { value: localStorage, writable: true });

      const faultyJqXhr = {
        getResponseHeader: () => {
          throw new Error('SecurityError');
        },
      };

      // We expect the function to run without throwing an error
      expect(() => retrieveAndSaveRequestIdJQuery(faultyJqXhr)).not.toThrow();
      
      // And localStorage should not have been called
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should transform response keys to camelCase in ajaxRequestInterceptor when isInCamelCase is true', () => {
      const options = {
        data: '{"isInCamelCase":true}',
        headers: {},
        // Mock a simple JSON parser for the test
        converters: { 'text json': (text) => JSON.parse(text) },
      };

      ajaxRequestInterceptor(options);

      const mockResponseText = '{"user_id": 1, "first_name": "test"}';
      // Execute the converter that the interceptor modified
      const transformedResponse = options.converters['text json'](mockResponseText);

      expect(transformedResponse).toEqual({ userId: 1, firstName: 'test' });
    });

    it('should remove isInCamelCase flag from data in ajaxRequestInterceptor', () => {
      const options = {
        data: '{"user_id":1,"isInCamelCase":true}',
        headers: {},
        converters: { 'text json': (text) => JSON.parse(text) },
      };

      ajaxRequestInterceptor(options);

      // The final data string should not contain the isInCamelCase flag
      expect(options.data).toBe('{"user_id":1}');
    });

    it('should add a response transformer to convert keys to camelCase in axiosRequestInterceptor', () => {
      const request = {
        data: { isInCamelCase: true },
        transformRequest: [],
        transformResponse: [],
      };

      const interceptedRequest = axiosRequestInterceptor(request);
      const responseTransformer = interceptedRequest.transformResponse[0];
      const mockResponseData = { user_id: 1, first_name: 'test' };
      
      const transformedData = responseTransformer(mockResponseData);

      expect(transformedData).toEqual({ userId: 1, firstName: 'test' });
    });

    it('should still add transformers in axiosRequestInterceptor if data is undefined but isInCamelCase is an option', () => {
      const request = {
        isInCamelCase: true, // Set as a root config option
        data: undefined,
        transformRequest: [],
        transformResponse: [],
      };

      const interceptedRequest = axiosRequestInterceptor(request);

      // Transformers should be added even if there's no request data
      expect(interceptedRequest.transformRequest.length).toBe(1);
      expect(interceptedRequest.transformResponse.length).toBe(1);
    });

    it('should remove isInCamelCase flag from data in axiosRequestInterceptor', () => {
      const request = {
        data: { user_id: 1, isInCamelCase: true },
        transformRequest: [],
        transformResponse: [],
      };

      const interceptedRequest = axiosRequestInterceptor(request);

      // The data object in the returned config should not have the flag
      expect(interceptedRequest.data.isInCamelCase).toBeUndefined();
      expect(interceptedRequest.data).toEqual({ user_id: 1 });
    });

    it('should not dispatch an event for a jqXHR error that has no responseJSON property', () => {
      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent').mockImplementation(() => {});
      
      // A mock jqXHR error object without the responseJSON property
      const mockJqXhrError = {
        status: 503,
        statusText: 'Service Unavailable',
      };

      handleError(mockJqXhrError, 'toastErrorUi', 'Service is down', 503);

      // No event should be dispatched because a response payload with a request_id is missing.
      expect(dispatchEventSpy).not.toHaveBeenCalled();
      
      dispatchEventSpy.mockRestore();
    });

    it('should not dispatch an event if the Axios error response.data is null', () => {
      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent').mockImplementation(() => {});
      
      const mockAxiosError = {
        response: {
          data: null, // response.data is null
          status: 500,
        },
      };

      handleError(mockAxiosError, 'fullScreenGlobalError', 'An error occurred', 500);

      // No event should be dispatched as there's no data to parse for a request_id.
      expect(dispatchEventSpy).not.toHaveBeenCalled();
      
      dispatchEventSpy.mockRestore();
    });
  });
});
