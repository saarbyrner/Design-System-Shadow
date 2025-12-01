import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/getGroupings';
import { axios } from '@kitman/common/src/utils/services';
import getGroupings from '../getGroupings';

describe('getGroupings', () => {
  describe('handler response', () => {
    it('returns the correct data', async () => {
      const returnedData = await getGroupings();

      expect(returnedData).toEqual(serverResponse);
    });
  });

  describe('response mocked', () => {
    let request;
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'get')
        .mockReturnValue({ data: serverResponse });
    });

    it('calls the correct endpoint', async () => {
      await getGroupings();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        '/reporting/charts/data_source_groupings'
      );
    });
  });
});
