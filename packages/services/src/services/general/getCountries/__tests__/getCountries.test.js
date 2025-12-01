import { axios } from '@kitman/common/src/utils/services';
import { countriesData } from '@kitman/services/src/mocks/handlers/general/getCountries';
import { getCountries } from '../index';

describe('getCountries', () => {
  describe('Handler response', () => {
    it('returns countries', async () => {
      const returnedData = await getCountries();
      expect(returnedData).toEqual(countriesData);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'get').mockResolvedValue({
        data: countriesData,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await getCountries();

      expect(returnedData).toEqual(countriesData);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/ui/countries');
    });
  });
});
