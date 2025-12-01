// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { BenchmarkWindowsResponse } from '@kitman/modules/src/Benchmarking/shared/types/index';

const getBenchmarkingWindows = async (): Promise<BenchmarkWindowsResponse> => {
  const { data } = await axios.get('/benchmark/windows');
  return data;
};

export default getBenchmarkingWindows;
