import pollingServiceWrapper from '../pollingServiceWrapper';

describe('pollingServiceWrapper()', () => {
  describe('when service call succeeds', () => {
    it('should return data with status', async () => {
      const mockResponse = {
        data: { 1: { value: { numerator: 1450, denominator: 1445 } } },
        status: 200,
      };
      const mockService = jest.fn().mockResolvedValue(mockResponse);
      const wrappedService = pollingServiceWrapper(mockService);
      const params = [
        { tableContainerId: 90540, columnId: 481839, data: null },
      ];

      const result = await wrappedService(...params);

      expect(mockService).toHaveBeenCalledWith(...params);
      expect(result).toEqual({
        data: {
          1: { value: { numerator: 1450, denominator: 1445 } },
          status: 200,
        },
      });
    });

    it('should return data with status with no data', async () => {
      const mockResponse = {
        data: null,
        status: 204,
      };
      const mockService = jest.fn().mockResolvedValue(mockResponse);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        data: {
          ...null,
          status: 204,
        },
      });
    });

    it('should handle response with empty data object', async () => {
      const mockResponse = {
        data: {},
        status: 200,
      };
      const mockService = jest.fn().mockResolvedValue(mockResponse);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        data: {
          status: 200,
        },
      });
    });
  });

  describe('when service call fails', () => {
    it('should return error with status from e.status', async () => {
      const mockError = {
        status: 404,
        statusText: 'Not Found',
      };
      const mockService = jest.fn().mockRejectedValue(mockError);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        error: {
          status: 404,
          error: 'Not Found',
        },
      });
    });

    it('should return Internal Server Error with status from e.response.status', async () => {
      const mockError = {
        response: {
          status: 500,
        },
        statusText: 'Internal Server Error',
      };
      const mockService = jest.fn().mockRejectedValue(mockError);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        error: {
          status: 500,
          error: 'Internal Server Error',
        },
      });
    });

    it('should return Unauthorized error with status from e.response.status', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized access',
          },
        },
      };
      const mockService = jest.fn().mockRejectedValue(mockError);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        error: {
          status: 401,
          error: 'Unauthorized access',
        },
      });
    });

    it('should return error with status from e.response.data.status_code', async () => {
      const mockError = {
        response: {
          data: {
            status_code: 422,
            errors: ['Validation failed'],
          },
        },
      };
      const mockService = jest.fn().mockRejectedValue(mockError);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        error: {
          status: 422,
          error: ['Validation failed'],
        },
      });
    });

    it('should return error with status when 403 error occurs', async () => {
      const mockError = {
        response: {
          data: {
            status_code: 403,
            error: 'User not allowed to display protected data',
          },
        },
      };
      const mockService = jest.fn().mockRejectedValue(mockError);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        error: {
          status: 403,
          error: 'User not allowed to display protected data',
        },
      });
    });

    it('should return error with default status -1 when no status is available', async () => {
      const mockError = {
        message: 'Network error',
      };
      const mockService = jest.fn().mockRejectedValue(mockError);
      const wrappedService = pollingServiceWrapper(mockService);

      const result = await wrappedService();

      expect(result).toEqual({
        error: {
          status: -1,
          error: 'Unknown',
        },
      });
    });
  });

  it('should handle error with empty object', async () => {
    const mockError = {};
    const mockService = jest.fn().mockRejectedValue(mockError);
    const wrappedService = pollingServiceWrapper(mockService);

    const result = await wrappedService();

    expect(result).toEqual({
      error: {
        status: -1,
        error: 'Unknown',
      },
    });
  });

  it('should handle error with null values', async () => {
    const mockError = {
      status: null,
      statusText: null,
      response: {
        status: null,
        data: {
          status_code: null,
          message: null,
        },
      },
    };
    const mockService = jest.fn().mockRejectedValue(mockError);
    const wrappedService = pollingServiceWrapper(mockService);

    const result = await wrappedService();

    expect(result).toEqual({
      error: {
        status: -1,
        error: 'Unknown',
      },
    });
  });
});
