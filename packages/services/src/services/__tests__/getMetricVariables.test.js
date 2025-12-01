import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getMetricVariables';
import { axios } from '@kitman/common/src/utils/services';

import getMetricVariables from '../getMetricVariables';

describe('getMetricVariables', () => {
  it('calls the correct endpoint and returns the correct value if no arguments are given', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const returnedData = await getMetricVariables();

    expect(returnedData).toEqual(serverResponse);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/ui/metric_variables', {
      params: { benchmark_testing: false },
    });
  });

  it('calls the correct endpoint and returns the correct value if isBenchmarkTesting is true', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const returnedData = await getMetricVariables({ isBenchmarkTesting: true });

    expect(returnedData).toEqual(serverResponse);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/ui/metric_variables', {
      params: { benchmark_testing: true },
    });
  });

  it('calls the correct endpoint and returns the correct value if isBenchmarkTesting is false', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const returnedData = await getMetricVariables({
      isBenchmarkTesting: false,
    });

    expect(returnedData).toEqual(serverResponse);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/ui/metric_variables', {
      params: { benchmark_testing: false },
    });
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getMetricVariables();
    }).rejects.toThrow();
  });
});
