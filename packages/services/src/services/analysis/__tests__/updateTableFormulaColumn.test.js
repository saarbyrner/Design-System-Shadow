import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/updateTableFormulaColumn';
// eslint-disable-next-line jest/no-mocks-import
import { ADD_FORMULA_COLUMN_MOCK as UPDATE_FORMULA_COLUMN_MOCK } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import updateTableFormulaColumn from '../updateTableFormulaColumn';

describe('updateTableFormulaColumn', () => {
  const tableContainerId = 1;
  const columnId = 2;

  describe('handler response', () => {
    it('returns the correct data', async () => {
      const returnedData = await updateTableFormulaColumn({
        tableContainerId,
        columnId,
        columnData: UPDATE_FORMULA_COLUMN_MOCK,
      });

      expect(returnedData).toEqual(serverResponse);
    });
  });

  describe('response mocked', () => {
    let request;
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'put')
        .mockReturnValue({ data: serverResponse });
    });

    it('calls the correct endpoint', async () => {
      await updateTableFormulaColumn({
        tableContainerId,
        columnId,
        columnData: UPDATE_FORMULA_COLUMN_MOCK,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        `/table_containers/${tableContainerId}/table_columns/${columnId}`,
        UPDATE_FORMULA_COLUMN_MOCK
      );
    });
  });
});
