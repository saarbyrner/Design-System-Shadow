import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/getDashboardGroups';
import { axios } from '@kitman/common/src/utils/services';
import getDashboardGroups from '../getDashboardGroups';

describe('getDashboardGroups', () => {
  describe('handler response', () => {
    it('returns the correct data', async () => {
      const returnedData = await getDashboardGroups();

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
      await getDashboardGroups();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        '/ui/reporting/dashboard_groups/list'
      );
    });
  });
});
