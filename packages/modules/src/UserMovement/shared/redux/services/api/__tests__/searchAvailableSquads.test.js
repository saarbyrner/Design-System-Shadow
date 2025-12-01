import { axios } from '@kitman/common/src/utils/services';
import searchAvailableSquads from '../searchAvailableSquads';
import { response } from '../../mocks/handlers/searchAvailableSquads';

describe('searchAvailableSquads', () => {
  const args = {
    id: 1,
  };

  let searchAvailableSquadsRequest;

  describe('successful requests', () => {
    beforeEach(() => {
      searchAvailableSquadsRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('fetches the available squads', async () => {
      const returnedData = await searchAvailableSquads(args);

      expect(returnedData).toEqual(response);

      expect(searchAvailableSquadsRequest).toHaveBeenCalledTimes(1);
      expect(searchAvailableSquadsRequest).toHaveBeenCalledWith(
        '/ui/organisation/organisations/squads',
        {
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
          },
          params: {
            id: 1,
          },
        }
      );
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      searchAvailableSquadsRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        searchAvailableSquads({
          id: 1,
        })
      ).rejects.toThrow();
    });
  });
});
