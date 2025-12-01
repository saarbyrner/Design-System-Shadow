// flow
import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchFavoriteContacts.mock';
import fetchFavoriteContacts, {
  endpoint,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchFavoriteContacts';

describe('fetchFavoriteContacts', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchFavoriteContacts();

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await fetchFavoriteContacts();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint);
    });
  });
});
