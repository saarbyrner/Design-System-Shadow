/* eslint-disable jest/no-conditional-expect */
import { requestIdLocalStorageKey } from '@kitman/common/src/consts/services';
import { AxiosError } from 'axios';
import { axiosResponseErrorInterceptor } from '../services';

describe('axiosResponseErrorInterceptor()', () => {
  let localStorageMock;

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

  it('should throw an error for status code 422', () => {
    const mockError = {
      response: {
        data: {
          data: [{ field: 'name', message: 'invalid' }],
          meta_data: { request_id: 'axios-123' },
        },
        status: 422,
        headers: {
          'x-request-id': 'axios-123',
        },
      },
      message: 'Request failed with status code 422',
      config: {
        method: 'get',
        url: '/test',
      },
    };

    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error for status code 404', () => {
    const mockError = {
      response: {
        data: {
          message: 'Not Found',
          meta_data: { request_id: 'axios-456' },
        },
        status: 404,
        headers: {
          'x-request-id': 'axios-456',
        },
      },
      message: 'Request failed with status code 404',
      config: {
        method: 'get',
        url: '/test',
      },
    };

    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error for status code 500', () => {
    const mockError = {
      response: {
        data: {
          message: 'Internal Server Error',
          meta_data: { request_id: 'axios-789' },
        },
        status: 500,
        headers: {
          'x-request-id': 'axios-789',
        },
      },
      message: 'Request failed with status code 500',
      config: {
        method: 'get',
        url: '/test',
      },
    };

    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error even without a request ID', () => {
    const mockError = {
      response: {
        data: {
          message: 'Bad Request',
        },
        status: 400,
        headers: {},
      },
      message: 'Request failed with status code 400',
      config: {
        method: 'get',
        url: '/test',
      },
    };

    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error when response data is an empty array', () => {
    const mockError = {
      response: {
        data: [],
        status: 500,
        headers: {
          'x-request-id': 'axios-abc'
        },
      },
      message: 'Request failed with status code 500',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error when response data is a string', () => {
    const mockError = {
      response: {
        data: 'Internal Server Error',
        status: 500,
        headers: {
          'x-request-id': 'axios-def'
        },
      },
      message: 'Request failed with status code 500',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error when response data is null', () => {
    const mockError = {
      response: {
        data: null,
        status: 500,
        headers: {
          'x-request-id': 'axios-ghi'
        },
      },
      message: 'Request failed with status code 500',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error when response is null', () => {
    const mockError = {
      response: null,
      message: 'Request failed',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should throw an error when response is undefined', () => {
    const mockError = {
      response: undefined,
      message: 'Request failed',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
  });

  it('should call localStorage.setItem when updated-error-screen is true', () => {
    window.featureFlags['updated-error-screen'] = true;
    const mockError = {
      response: {
        data: {
          message: 'Bad Request',
        },
        status: 400,
        headers: { 'x-request-id': 'axios-jkl' },
      },
      message: 'Request failed with status code 400',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(requestIdLocalStorageKey, 'axios-jkl');
  });

  it('should not call localStorage.setItem when updated-error-screen is false', () => {
    window.featureFlags['updated-error-screen'] = false;
    const mockError = {
      response: {
        data: {
          message: 'Bad Request',
        },
        status: 400,
        headers: { 'x-request-id': 'axios-mno' },
      },
      message: 'Request failed with status code 400',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow(mockError.message);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should throw an error when localStorage access fails', () => {
    window.featureFlags['updated-error-screen'] = true;
    const mockError = {
      response: {
        data: {
          message: 'Bad Request',
        },
        status: 400,
        headers: { 'x-request-id': 'axios-pqr' },
      },
      message: 'Request failed with status code 400',
      config: {
        method: 'get',
        url: '/test',
      },
    };
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    expect(() => axiosResponseErrorInterceptor(mockError)).toThrow();
  });

  it('should not include a "cause" key in the thrown error', () => {
    const mockError = new AxiosError(
      'Request failed with status code 400',
      'ERR_BAD_REQUEST',
      {
        method: 'get',
        url: '/test',
      },
      {},
      {
        data: {
          message: 'Test Error',
        },
        status: 400,
        headers: {},
      },
    );

    let thrownError;
    try {
      axiosResponseErrorInterceptor(mockError);
    } catch (e) {
      thrownError = e;
    }

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError).not.toHaveProperty('cause');
  });
});
