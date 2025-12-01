// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { BenchmarkSeasonsResponse } from '@kitman/modules/src/Benchmarking/shared/types/index';

const getBenchmarkingSeasons = async (): Promise<BenchmarkSeasonsResponse> => {
  const { data } = await axios.get('/benchmark/seasons');
  return data;
};

export default getBenchmarkingSeasons;
