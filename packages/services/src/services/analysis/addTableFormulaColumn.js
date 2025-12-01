// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  TableFormulaColumnData,
  TableFormulaColumnResponse,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

export type AddTableFormulaColumnParams = {
  tableContainerId: number,
  columnData: TableFormulaColumnData,
};

const addTableFormulaColumn = async ({
  tableContainerId,
  columnData,
}: AddTableFormulaColumnParams): Promise<TableFormulaColumnResponse> => {
  const { data } = await axios.post(
    `/table_containers/${tableContainerId}/table_columns`,
    columnData
  );
  return data;
};

export default addTableFormulaColumn;
