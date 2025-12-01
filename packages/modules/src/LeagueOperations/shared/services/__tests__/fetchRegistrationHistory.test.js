import { axios } from '@kitman/common/src/utils/services';
import { data as response } from '../mocks/handlers/fetchRegistrationHistory';

import fetchRegistrationHistory from '../fetchRegistrationHistory';

describe('fetchRegistrationHistory', () => {
  let fetchRegistrationHistoryRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRegistrationHistoryRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: response.data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await fetchRegistrationHistory({
        id: 1,
        user_id: 1,
      });

      expect(returnedData).toEqual(response.data);

      expect(fetchRegistrationHistoryRequest).toHaveBeenCalledTimes(1);
      expect(fetchRegistrationHistoryRequest).toHaveBeenCalledWith(
        '/registration/users/1/registrations/1/history'
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRegistrationHistoryRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        fetchRegistrationHistory({
          id: 1,
          user_id: 1,
        })
      ).rejects.toThrow();
    });
  });
});
