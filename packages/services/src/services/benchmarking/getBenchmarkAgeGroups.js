// @flow
import { axios } from '@kitman/common/src/utils/services';

export type BenchmarkAgeGroup = {
  id: number,
  name: string,
};

const getBenchmarkAgeGroups = async (): Promise<Array<BenchmarkAgeGroup>> => {
  const { data } = await axios.get('/benchmark/age_groups');
  return data;
};

export default getBenchmarkAgeGroups;
