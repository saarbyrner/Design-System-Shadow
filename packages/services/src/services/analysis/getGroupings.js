// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Grouping } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';

const getGroupings = async (): Promise<Array<Grouping>> => {
  const { data } = await axios.get(`/reporting/charts/data_source_groupings`);

  return data;
};

export default getGroupings;
