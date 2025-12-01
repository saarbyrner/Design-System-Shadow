import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '../../mocks/handlers/fetchUserData';
import fetchUserData from '../fetchUserData';

describe('fetchUserData', () => {
  let fetchUserDataRequest;

  describe('successful requests', () => {
    beforeEach(() => {
      fetchUserDataRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: serverResponse }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('fetches the user only', async () => {
      const returnedData = await fetchUserData({ userId: 1 });

      expect(returnedData).toEqual(serverResponse);

      expect(fetchUserDataRequest).toHaveBeenCalledTimes(1);
      expect(fetchUserDataRequest).toHaveBeenCalledWith('/users/1', {
        headers: { Accept: 'application/json' },
        params: {
          include_athlete: false,
        },
      });
    });

    it('fetches the athlete when requests only', async () => {
      const returnedData = await fetchUserData({
        userId: 1,
        include_athlete: true,
      });

      expect(returnedData).toEqual(serverResponse);

      expect(fetchUserDataRequest).toHaveBeenCalledTimes(1);
      expect(fetchUserDataRequest).toHaveBeenCalledWith('/users/1', {
        headers: { Accept: 'application/json' },
        params: {
          include_athlete: true,
        },
      });
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchUserDataRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        fetchUserData({
          userId: 1,
          include_athlete: true,
        })
      ).rejects.toThrow();
    });
  });
});
