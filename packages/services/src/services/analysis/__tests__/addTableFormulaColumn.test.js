import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/addTableFormulaColumn';
// eslint-disable-next-line jest/no-mocks-import
import { ADD_FORMULA_COLUMN_MOCK } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import addTableFormulaColumn from '../addTableFormulaColumn';

describe('addTableFormulaColumn', () => {
  const tableContainerId = 1;

  describe('handler response', () => {
    it('returns the correct data', async () => {
      const returnedData = await addTableFormulaColumn({
        tableContainerId,
        columnData: ADD_FORMULA_COLUMN_MOCK,
      });

      expect(returnedData).toEqual(serverResponse);
    });
  });

  describe('response mocked', () => {
    let request;
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'post')
        .mockReturnValue({ data: serverResponse });
    });

    it('calls the correct endpoint', async () => {
      await addTableFormulaColumn({
        tableContainerId,
        columnData: ADD_FORMULA_COLUMN_MOCK,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        `/table_containers/${tableContainerId}/table_columns`,
        ADD_FORMULA_COLUMN_MOCK
      );
    });
  });
});
