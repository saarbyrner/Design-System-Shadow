import { axios } from '@kitman/common/src/utils/services';
import deleteChartElement from '../deleteChartElement';

describe('deleteChartElement', () => {
  const chartId = 1;
  const chartElementId = 1;

  describe('hanlder response', () => {
    it('returns no data', async () => {
      const returnedData = await deleteChartElement({
        chartId,
        chartElementId,
      });

      expect(returnedData).toEqual('');
    });
  });

  describe('response mocked', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'delete').mockReturnValue({ data: '' });
    });

    it('calls the correct endpoint', async () => {
      await deleteChartElement({
        chartId,
        chartElementId,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        '/reporting/charts/1/chart_elements/1'
      );
    });
  });
});
