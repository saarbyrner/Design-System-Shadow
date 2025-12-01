import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getVenueTypes';
import { axios } from '@kitman/common/src/utils/services';
import getVenueTypes from '../getVenueTypes';

describe('getVenueTypes', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the default value', async () => {
    const returnedData = await getVenueTypes();

    expect(returnedData).toEqual(serverResponse);
  });

  it('calls the correct endpoint with args and returns the nfl value', async () => {
    const returnedData = await getVenueTypes(true);

    expect(returnedData).toEqual(serverResponse);
  });

  describe('failure', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(getVenueTypes()).rejects.toThrow();
    });
  });
});
