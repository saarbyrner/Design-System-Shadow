// @flow
import { axios } from '@kitman/common/src/utils/services';

const getBenchmarkingResults = async (
  org: number,
  window: number,
  season: number
): Promise<any> => {
  const { data } = await axios.post('/benchmark/validations', {
    organisation_id: org,
    benchmark_testing_window_id: window,
    season,
  });
  return data;
};

export default getBenchmarkingResults;
