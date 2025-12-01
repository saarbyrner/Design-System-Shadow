// @flow
import { axios } from '@kitman/common/src/utils/services';

export type BenchmarkMaturationStatus = {
  id: number,
  name: string,
};

const getBenchmarkMaturationStatuses = async (): Promise<
  Array<BenchmarkMaturationStatus>
> => {
  const { data } = await axios.get('/benchmark/maturity_offset_status');
  return data;
};

export default getBenchmarkMaturationStatuses;
