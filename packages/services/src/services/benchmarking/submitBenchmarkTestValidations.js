// @flow
import { axios } from '@kitman/common/src/utils/services';

type ValidatedMetrics = ?Array<{
  training_variable_id: number,
  age_group_season_id: number,
}>;

const submitBenchmarkTestValidations = async (
  org: number,
  window: number,
  seasonYear: string,
  validatedMetrics: ValidatedMetrics
): Promise<ValidatedMetrics> => {
  const { data } = await axios.post('/benchmark/validate', {
    organisation_id: org,
    benchmark_testing_window_id: window,
    season: seasonYear,
    validated_metrics: validatedMetrics,
  });
  return data;
};

export default submitBenchmarkTestValidations;
