import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/addChartElement';
import { axios } from '@kitman/common/src/utils/services';
// eslint-disable-next-line jest/no-mocks-import
import { generateChartElement } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import addChartElement from '../addChartElement';

describe('addChartElement', () => {
  const chartId = 1;
  const chartElement = generateChartElement();

  describe('handler response', () => {
    it('returns the correct data', async () => {
      const returnedData = await addChartElement({
        chartId,
        chartElement,
      });

      expect(returnedData).toEqual({
        ...serverResponse,
      });
    });
  });

  describe('response mocked', () => {
    let request;
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'post')
        .mockReturnValue({ data: serverResponse });
    });

    it('calls the correct endpoint', async () => {
      await addChartElement({
        chartId,
        chartElement,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        '/reporting/charts/1/chart_elements',
        { ...chartElement }
      );
    });
  });
});
