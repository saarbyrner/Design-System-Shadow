import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/refreshWidgetCache';
import { axios } from '@kitman/common/src/utils/services';
import refreshWidgetCache from '../refreshWidgetCache';

describe('refreshWidgetCache', () => {
  const tableContainerId = 1;

  describe('handler response', () => {
    it('returns the correct data', async () => {
      const { data } = await refreshWidgetCache(tableContainerId);
      expect(data).toEqual(serverResponse);
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
      await refreshWidgetCache(tableContainerId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        `/table_containers/${tableContainerId}/refresh_cache`
      );
    });
  });
});
