import axios from 'axios';
import { validateResponseWithRetry } from '../serviceQueryPolling';

jest.mock('axios');

describe('serviceQueryPolling', () => {
  const mockFn = jest.fn(async (args) => axios.post('/api', args));

  const requestData = {
    id: 1234,
    name: 'Minutes (Training Session) (mins) - Z-Score',
    refresh_cache: false,
  };

  const response = {
    data: {
      data: [
        {
          id: '422',
          config: {},
          metadata: {
            aggregation_method: 'mean',
            rounding_places: 2,
          },
          chart: [
            {
              value: '-0.31',
            },
          ],
          overlays: null,
        },
      ],
      status: 200,
    },
  };

  const mockAcceptedResponse = {
    data: {
      message: 'Your request is still processing',
      status: 202,
    },
  };

  const mockTimedOutResponse = {
    error: {
      message: 'Your request has timed out',
      status: 504,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateResponseWithRetry()', () => {
    it('should return the response on success', async () => {
      const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce(response);

      const result = await validateResponseWithRetry(mockFn);

      expect(result).toEqual(response.data);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    it('should return error other than 504 and not poll', async () => {
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce({ data: { error: { status: 503 } } });

      const result = await validateResponseWithRetry(mockFn);
      expect(result.error).toEqual({ status: 503 });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    it('should retry if the server responds with 202', async () => {
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce(mockAcceptedResponse) // 1st Attempt - Accepted, but still processing
        .mockResolvedValueOnce(response); // 2nd Attempt - Success

      await validateResponseWithRetry(mockFn, requestData, 1);
      expect(postSpy).toHaveBeenCalledTimes(2);
    });

    it('should retry if the server responds with 504', async () => {
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce(mockTimedOutResponse) // 1st Attempt - Timed Out
        .mockResolvedValueOnce(mockTimedOutResponse) // 2nd Attempt - Timed Out
        .mockResolvedValueOnce(response); // 3rd Attempt - Success

      await validateResponseWithRetry(mockFn, requestData, 1);
      expect(postSpy).toHaveBeenCalledTimes(3);
    });

    it('should stop retrying once server responds final response', async () => {
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce(mockTimedOutResponse) // 1st Attempt - Timed Out
        .mockResolvedValueOnce(mockAcceptedResponse) // 2nd Attempt - Accepted, but still processing
        .mockResolvedValueOnce(response); // 3rd Attempt - Success

      const result = await validateResponseWithRetry(mockFn, requestData, 1);
      expect(result).toEqual(response.data);
      expect(postSpy).toHaveBeenCalledTimes(3);
    });

    it('should flip refresh_cache to false on retry after 202', async () => {
      const initialArgs = { ...requestData, refresh_cache: true };
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce(mockAcceptedResponse) // returns 202
        .mockResolvedValueOnce(response); //  succeeds

      await validateResponseWithRetry(mockFn, initialArgs, 1);

      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(postSpy.mock.calls[0][1].refresh_cache).toBe(true);
      expect(postSpy.mock.calls[1][1].refresh_cache).toBe(false);
    });

    it('should flip refresh_cache to false on retry after 504', async () => {
      const initialArgs = { ...requestData, refresh_cache: true };
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce(mockTimedOutResponse) // times out and returns 504
        .mockResolvedValueOnce(response); //  succeeds

      await validateResponseWithRetry(mockFn, initialArgs, 1);

      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(postSpy.mock.calls[0][1].refresh_cache).toBe(true);
      expect(postSpy.mock.calls[1][1].refresh_cache).toBe(false);
    });
  });
});
