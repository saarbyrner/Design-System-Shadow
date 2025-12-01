import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getMedicationProviders';
import getMedicationProviders from '../getMedicationProviders';

describe('getMedicationProviders', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct data', async () => {
    const returnedData = await getMedicationProviders();
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getMedicationProviders();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/ui/medical/medications/providers');
    });
  });
});
