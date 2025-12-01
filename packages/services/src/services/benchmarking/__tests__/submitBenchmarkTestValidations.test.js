import { submitBenchmarkTestValidationsData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import submitBenchmarkTestValidations from '../submitBenchmarkTestValidations';

describe('getBenchmarkingClubs', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should respond with benchmark validation results', async () => {
    const mockValidatedMetrics = [
      { age_group_season_id: 223, training_variable_id: 16340 },
      { age_group_season_id: 223, training_variable_id: 16341 },
      { age_group_season_id: 223, training_variable_id: 16342 },
      { age_group_season_id: 223, training_variable_id: 16343 },
    ];

    const response = await submitBenchmarkTestValidations(
      1,
      1,
      2000,
      mockValidatedMetrics
    );

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/benchmark/validate', {
      benchmark_testing_window_id: 1,
      organisation_id: 1,
      season: 2000,
      validated_metrics: mockValidatedMetrics,
    });
  });

  it('should respond with null if there are no validated metrics', async () => {
    const response = await submitBenchmarkTestValidations(1, 1, 2000, null);

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/benchmark/validate', {
      benchmark_testing_window_id: 1,
      organisation_id: 1,
      season: 2000,
      validated_metrics: null,
    });
  });
});
