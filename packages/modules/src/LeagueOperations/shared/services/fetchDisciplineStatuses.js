// @flow
import { axios } from '@kitman/common/src/utils/services';

export type DisciplineStatusesType = Array<string>;

const fetchDisciplineStatuses = async (): Promise<DisciplineStatusesType> => {
  const { data } = await axios.get(`/discipline/statuses`);

  return data;
};

export default fetchDisciplineStatuses;
