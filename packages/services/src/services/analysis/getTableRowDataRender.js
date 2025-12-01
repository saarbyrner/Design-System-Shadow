// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { TableWidgetRowDataRender } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

type PivotParams = {
  pivot: {
    time_period: ?string,
    time_period_length: ?number,
    date_range: ?{
      start_date: string,
      end_date: string,
    },
    population: SquadAthletesSelection,
  },
};
type RequestParams = {
  tableContainerId: number,
  rowId: number,
  pivotParams: PivotParams | null,
};

const getTableRowDataRender = async ({
  tableContainerId,
  rowId,
  pivotParams,
}: RequestParams): Promise<TableWidgetRowDataRender> => {
  const response = await axios.post(
    `/table_containers/${tableContainerId}/table_rows/${rowId}/data_render`,
    pivotParams,
    {
      timeout: 0, // BE handles the timeout
    }
  );
  return response;
};

export default getTableRowDataRender;
