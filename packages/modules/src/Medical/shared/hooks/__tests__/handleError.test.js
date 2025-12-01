import mockI18n from '@kitman/common/src/utils/i18n';
import handleError from '../handleError';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key) => key),
}));

describe('handleError', () => {
  // Spy on window.dispatchEvent to check if the custom event is dispatched
  const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

  beforeEach(() => {
    // Clear mocks before each test
    dispatchEventSpy.mockClear();
    mockI18n.t.mockClear(); // Clear the i18n.t mock as well
  });

  // Test case 1: No error object provided
  // Assuming handleError takes (errorObject, onAttemptHandleError, dataToPass)
  test('should return early if no error object is provided', () => {
    handleError(null, jest.fn());
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    expect(mockI18n.t).not.toHaveBeenCalled(); // No error object, so t() isn't reached
  });

  // Test case 2: Error object with unexpected structure (e.g., no responseJSON)
  test('should not dispatch globalError if error.responseJSON is missing', () => {
    const error = {}; // Missing responseJSON
    const onAttemptHandleError = jest.fn();
    handleError(error, onAttemptHandleError);
    expect(onAttemptHandleError).not.toHaveBeenCalled(); // No errors to process
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    // EXPECTATION CHANGED: i18n.t *will* be called because responseCode falls back to it
    expect(mockI18n.t).toHaveBeenCalledWith('No request id available');
  });

  // Test case 3: Error object with responseJSON but no data array
  test('should not dispatch globalError if error.responseJSON.data is missing or not an array', () => {
    const onAttemptHandleError = jest.fn();

    const error = {
      responseJSON: {
        meta_data: { request_id: 'req123' },
        // data is missing here
      },
    };
    handleError(error, onAttemptHandleError);
    expect(onAttemptHandleError).not.toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    // i18n.t should NOT be called because request_id 'req123' is found
    expect(mockI18n.t).not.toHaveBeenCalled();

    mockI18n.t.mockClear(); // Clear for the next part of this test

    const errorWithNonArrayData = {
      responseJSON: {
        meta_data: { request_id: 'req123' },
        data: 'not an array', // data is not an array
      },
    };
    handleError(errorWithNonArrayData, onAttemptHandleError);
    expect(onAttemptHandleError).not.toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    // i18n.t should NOT be called because request_id 'req123' is found
    expect(mockI18n.t).not.toHaveBeenCalled();
  });

  // Test case 4: Error with an empty error list
  test('should not dispatch globalError if error list is empty', () => {
    const error = {
      responseJSON: {
        meta_data: { request_id: 'reqEmpty' },
        data: [], // Empty error list
      },
    };
    const onAttemptHandleError = jest.fn(() => true); // Assume it handles everything
    handleError(error, onAttemptHandleError);
    expect(onAttemptHandleError).not.toHaveBeenCalled(); // No errors to process
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    expect(mockI18n.t).not.toHaveBeenCalled(); // requestId is present
  });

  // Test case 5: All errors are handled by onAttemptHandleError
  test('should not dispatch globalError if all errors are handled by callback', () => {
    const mockErrors = [
      { key: 'error1', message: 'Message 1', type: 'validation' },
      { key: 'error2', message: 'Message 2', type: 'business' },
    ];
    const error = {
      responseJSON: {
        meta_data: { request_id: 'reqAllHandled' },
        data: mockErrors,
      },
    };
    const onAttemptHandleError = jest.fn(() => true); // Callback handles all errors
    const dataToPass = { someData: 'value' };

    handleError(error, onAttemptHandleError, dataToPass);

    expect(onAttemptHandleError).toHaveBeenCalledTimes(mockErrors.length);
    expect(onAttemptHandleError).toHaveBeenCalledWith(
      mockErrors[0],
      { errorCount: { total: 2, current: 1 }, code: 'reqAllHandled' },
      dataToPass
    );
    expect(onAttemptHandleError).toHaveBeenCalledWith(
      mockErrors[1],
      { errorCount: { total: 2, current: 2 }, code: 'reqAllHandled' },
      dataToPass
    );
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    expect(mockI18n.t).not.toHaveBeenCalled(); // requestId is present
  });

  // Test case 6: Some errors are handled, others are not
  test('should dispatch globalError with unhandled errors if callback handles some errors', () => {
    const mockErrors = [
      { key: 'error1', message: 'Message 1', type: 'validation' },
      { key: 'error2', message: 'Message 2', type: 'business' },
      { key: 'error3', message: 'Message 3', type: 'server' },
    ];
    const error = {
      responseJSON: {
        meta_data: { request_id: 'reqSomeHandled' },
        data: mockErrors,
      },
    };
    // Callback handles the first error, but not the others
    const onAttemptHandleError = jest.fn(
      (errorDetail) => errorDetail.key === 'error1'
    );
    const dataToPass = { someData: 'value' };

    handleError(error, onAttemptHandleError, dataToPass);

    expect(onAttemptHandleError).toHaveBeenCalledTimes(mockErrors.length);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'globalError',
        detail: {
          errorList: [
            { key: 'error2', message: 'Message 2', type: 'business' },
            { key: 'error3', message: 'Message 3', type: 'server' },
          ],
          errorType: 'fullScreenGlobalError', // Assuming default if not specified in handleError call
          requestId: 'reqSomeHandled',
        },
      })
    );
    expect(mockI18n.t).not.toHaveBeenCalled(); // requestId is present
  });

  // Test case 7: No errors are handled by onAttemptHandleError
  test('should dispatch globalError with all errors if callback handles no errors', () => {
    const mockErrors = [
      { key: 'errorA', message: 'Alpha', type: 'api' },
      { key: 'errorB', message: 'Beta', type: 'network' },
    ];
    const error = {
      responseJSON: {
        meta_data: { request_id: 'reqNoneHandled' },
        data: mockErrors,
      },
    };
    const onAttemptHandleError = jest.fn(() => false); // Callback handles no errors
    const dataToPass = { anotherData: 'moreValue' };

    handleError(error, onAttemptHandleError, dataToPass);

    expect(onAttemptHandleError).toHaveBeenCalledTimes(mockErrors.length);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'globalError',
        detail: {
          errorList: mockErrors, // All errors should be in the list
          errorType: 'fullScreenGlobalError', // Assuming default
          requestId: 'reqNoneHandled',
        },
      })
    );
    expect(mockI18n.t).not.toHaveBeenCalled(); // requestId is present
  });

  // Test case 8: Default request ID when not available (already working)
  test('should use "No request id available" if request_id is missing', () => {
    const mockErrors = [
      { key: 'error1', message: 'Message 1', type: 'validation' },
    ];
    const error = {
      responseJSON: {
        meta_data: {}, // request_id is missing, so it will be undefined
        data: mockErrors,
      },
    };
    const onAttemptHandleError = jest.fn(() => false);

    handleError(error, onAttemptHandleError);

    expect(mockI18n.t).toHaveBeenCalledWith('No request id available');
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          requestId: 'No request id available', // Expect the mocked translation
          errorList: mockErrors, // Ensure errorList is still passed
        }),
      })
    );
  });

  // Test case 9: onAttemptHandleError receives correct errorMetaData for multiple errors
  test('onAttemptHandleError should receive correct errorMetaData for each error', () => {
    const mockErrors = [
      { key: 'e1', message: 'msg1' },
      { key: 'e2', message: 'msg2' },
      { key: 'e3', message: 'msg3' },
    ];
    const error = {
      responseJSON: {
        meta_data: { request_id: 'testReqId' },
        data: mockErrors,
      },
    };
    const onAttemptHandleError = jest.fn(() => false); // Always return false

    handleError(error, onAttemptHandleError);

    // Check calls for each error detail
    expect(onAttemptHandleError).toHaveBeenCalledWith(
      mockErrors[0],
      { errorCount: { total: 3, current: 1 }, code: 'testReqId' },
      undefined // No dataToPassToCallBack provided in this test call
    );
    expect(onAttemptHandleError).toHaveBeenCalledWith(
      mockErrors[1],
      { errorCount: { total: 3, current: 2 }, code: 'testReqId' },
      undefined
    );
    expect(onAttemptHandleError).toHaveBeenCalledWith(
      mockErrors[2],
      { errorCount: { total: 3, current: 3 }, code: 'testReqId' },
      undefined
    );

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1); // One dispatch for all unhandled
    expect(mockI18n.t).not.toHaveBeenCalled(); // requestId is present
  });
});
