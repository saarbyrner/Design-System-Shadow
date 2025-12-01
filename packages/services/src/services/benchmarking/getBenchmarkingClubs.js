// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { BenchmarkClubsResponse } from '@kitman/modules/src/Benchmarking/shared/types/index';

const getBenchmarkingClubs = async (): Promise<BenchmarkClubsResponse> => {
  const { data } = await axios.get('/benchmark/organisations');
  return data;
};

export default getBenchmarkingClubs;
