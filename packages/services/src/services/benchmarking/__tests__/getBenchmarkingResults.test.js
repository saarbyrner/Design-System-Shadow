import { getBenchmarkingResultsData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkingResults from '../getBenchmarkingResults';

describe('getBenchmarkingClubs', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should respond with benchmark validation results', async () => {
    const response = await getBenchmarkingResults(6, 1, 2010);

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/benchmark/validations', {
      organisation_id: 6,
      benchmark_testing_window_id: 1,
      season: 2010,
    });
  });
});
