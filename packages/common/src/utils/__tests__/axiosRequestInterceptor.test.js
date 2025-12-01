/* eslint-disable global-require */
/* eslint-disable jest/no-conditional-expect */

import getCookie from '@kitman/common/src/utils/getCookie';
import { axiosRequestInterceptor } from '../services';

jest.mock('@kitman/common/src/utils/getCookie', () => jest.fn());

describe('axiosRequestInterceptor', () => {
  let getCookieMockImplementationSpy;

  beforeEach(() => {
    getCookie.mockReturnValue('omnomnom');
    getCookieMockImplementationSpy = jest.spyOn(
      getCookie,
      'mockImplementation'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    getCookieMockImplementationSpy.mockRestore();
  });

  it.each([
    {
      description: 'handles the default case correctly',
      input: { headers: {} },
      expected: {
        headers: {
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
      },
    },
    {
      description: 'handles the default case with data correctly',
      input: { headers: {}, data: {} },
      expected: {
        headers: {
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
        data: {},
      },
    },
    {
      description: 'handles truthy isInCamelCase in data correctly',
      input: {
        headers: {},
        data: { numberInCamelCase: 1, isInCamelCase: true },
        transformRequest: [],
        transformResponse: [],
      },
      expected: {
        headers: {
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
        data: { numberInCamelCase: 1 },
        transformRequest: [expect.any(Function)],
        transformResponse: [expect.any(Function)],
      },
      transformations: {
        request: {
          number_in_camel_case: 1,
        },
        response: {
          numberInCamelCase: 1,
        },
      },
    },
    {
      description: 'handles falsy isInCamelCase in data correctly',
      input: {
        headers: {},
        data: { numberInCamelCase: 1, isInCamelCase: false },
        transformRequest: [],
        transformResponse: [],
      },
      expected: {
        headers: {
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
        data: { numberInCamelCase: 1 },
        transformRequest: [],
        transformResponse: [],
      },
      transformations: {
        request: {
          number_in_camel_case: 1,
        },
        response: {
          numberInCamelCase: 1,
        },
      },
    },
    {
      description: 'handles isInCamelCase in options correctly',
      input: {
        headers: {},
        transformRequest: [],
        transformResponse: [],
        isInCamelCase: true,
      },
      expected: {
        headers: {
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
        transformRequest: [expect.any(Function)],
        transformResponse: [expect.any(Function)],
        isInCamelCase: true,
      },
      transformations: {
        request: undefined,
        response: undefined,
      },
    },
  ])('$description', ({ input, expected, transformations }) => {
    const req = axiosRequestInterceptor(input);

    expect(req).toEqual(expected);
    if (req.transformRequest?.length === 1) {
      expect(req.transformRequest[0](input.data)).toEqual(
        transformations.request
      );
    }
    if (req.transformResponse?.length === 1) {
      expect(req.transformResponse[0](input.data)).toEqual(
        transformations.response
      );
    }
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

    expect(interceptedRequest.transformRequest.length).toBe(1);
    expect(interceptedRequest.transformResponse.length).toBe(1);
  });
});
