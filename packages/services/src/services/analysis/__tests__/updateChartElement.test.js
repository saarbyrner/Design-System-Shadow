import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/updateChartElement';
import { axios } from '@kitman/common/src/utils/services';
// eslint-disable-next-line jest/no-mocks-import
import { generateChartElement } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import updateChartElement from '../updateChartElement';

describe('addChartElement', () => {
  const chartId = 1;

  const chartElement = generateChartElement();

  describe('handler response', () => {
    it('returns the correct data', async () => {
      const returnedData = await updateChartElement({
        chartId,
        chartElementId: chartElement.id,
        chartElement,
      });

      expect(returnedData).toEqual(serverResponse);
    });
  });

  describe('response mocked', () => {
    let request;
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'patch')
        .mockReturnValue({ data: serverResponse });
    });

    it('calls the correct endpoint', async () => {
      await updateChartElement({
        chartId,
        chartElementId: chartElement.id,
        chartElement,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        '/reporting/charts/1/chart_elements/1',
        { ...chartElement }
      );
    });
  });
});
