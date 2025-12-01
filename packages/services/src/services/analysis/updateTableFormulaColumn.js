// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  TableFormulaColumnData,
  TableFormulaColumnResponse,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

export type UpdateTableFormulaColumnParams = {
  tableContainerId: number,
  columnId: number,
  columnData: TableFormulaColumnData,
};

const updateTableFormulaColumn = async ({
  tableContainerId,
  columnId,
  columnData,
}: UpdateTableFormulaColumnParams): Promise<TableFormulaColumnResponse> => {
  const { data } = await axios.put(
    `/table_containers/${tableContainerId}/table_columns/${columnId}`,
    columnData
  );
  return data;
};

export default updateTableFormulaColumn;
