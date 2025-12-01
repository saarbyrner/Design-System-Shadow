// flow
import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/getUnreadCount.mock';
import getUnreadCount, {
  endpoint,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/getUnreadCount';

describe('getUnreadCount', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getUnreadCount();

    expect(returnedData).toEqual(data);
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
      await getUnreadCount();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint);
    });
  });
});
