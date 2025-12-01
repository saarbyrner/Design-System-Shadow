import getInitialData, {
  INITIAL_DATA_URL,
} from '@kitman/services/src/services/getInitialData';
import { axios } from '@kitman/common/src/utils/services';

describe('getInitialData', () => {
  it('returns the initial data object', async () => {
    const returnedData = await getInitialData();
    // verify the shape of the response
    expect(returnedData).toBeInstanceOf(Object);
    expect(returnedData).toHaveProperty('current_user');
    expect(returnedData).toHaveProperty('feature_flags');
    expect(returnedData).toHaveProperty('current_organisation');
  });

  describe('Axios call', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      await getInitialData();
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(INITIAL_DATA_URL);
    });
  });
});
