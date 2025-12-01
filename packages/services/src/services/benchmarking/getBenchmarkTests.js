// @flow
import { axios } from '@kitman/common/src/utils/services';

export type BenchmarkMetric = {
  id: number,
  name: string,
};

const getBenchmarkTests = async (): Promise<Array<BenchmarkMetric>> => {
  const { data } = await axios.get('/benchmark/metrics');
  return data;
};

export default getBenchmarkTests;
