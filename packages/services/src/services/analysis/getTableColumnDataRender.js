// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

type PivotParams = {
  pivot: {
    date_range?: Object,
    time_period?: string,
    time_period_length?: ?number,
    population: SquadAthletesSelection,
  },
};

type RequestParams = {
  tableContainerId: number,
  columnId: number,
  data: null | PivotParams,
};

const getTableColumnDataRender = async ({
  tableContainerId,
  columnId,
  data,
}: RequestParams) => {
  const response = await axios.post(
    `/table_containers/${tableContainerId}/table_columns/${columnId}/data_render`,
    { ...data },
    {
      timeout: 0, // leaving BE handle the timeout here
    }
  );
  return response;
};

export default getTableColumnDataRender;
