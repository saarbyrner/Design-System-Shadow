import { renderHook, act } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import { getColumnId } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
// eslint-disable-next-line jest/no-mocks-import
import { TABLE_DATA } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';
import getTableColumnDataRender from '@kitman/services/src/services/analysis/getTableColumnDataRender';
import useTableData from '../useTableData';

jest.mock(
  '@kitman/services/src/services/analysis/getTableColumnDataRender',
  () => jest.fn()
);

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@kitman/common/src/utils', () => {
  const utilsModule = jest.requireActual('@kitman/common/src/utils');

  jest.mock(
    '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard',
    () => jest.fn()
  );

  return {
    ...utilsModule,
    searchParams: jest.fn((key) => {
      if (key === 'pivot') return true;
      return undefined;
    }),
  };
});

describe('useTableData - ranking logic', () => {
  let dispatchMock;
  beforeEach(() => {
    useShouldRefreshDashboard.mockReturnValue(true);
    window.setFlag('table-updated-pivot', true);
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it('should apply ranking calculation to tableData: single and grouped values', async () => {
    const { rows, columns } = TABLE_DATA;
    const { result } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US')
    );

    await act(async () => {
      result.current.fetchData();
    });

    const columnKey = getColumnId(columns[0]);
    const data = result.current.tableData[columnKey]?.data;

    // Ranked single values
    expect(data?.[0]?.value).toBe(1);
    expect(data?.[2]?.value).toBe(2);

    // Ranked grouped values
    expect(data?.[1]?.children).toStrictEqual([
      { id: 'forward', value: 1 },
      { id: 'Loose-head Prop', value: 2 },
    ]);
  });

  it('should apply sorting calculation to tableData: single and grouped values', async () => {
    const { rows, columns } = TABLE_DATA;
    const columnId = getColumnId(columns[0]);

    const { result } = renderHook(() =>
      useTableData(1, 1, columns, rows, columnId, 'HIGH_LOW', null, 'en-US')
    );

    await act(async () => {
      result.current.fetchData();
    });

    const { sortedRows, dynamicRows } = result.current;

    // Sorted single rows
    expect(sortedRows[0].row_id).toBe('row_3'); // Value is 2
    expect(sortedRows[1].row_id).toBe('row_1'); // Value is 1
    expect(sortedRows[2].row_id).toBe('row_2'); // Value is undefined

    // Sort dynamic rows
    expect(dynamicRows.row_2[0]).toBe('Loose-head Prop'); // Value is 2
    expect(dynamicRows.row_2[1]).toBe('forward'); // Value is 1
  });

  describe('error handling', () => {
    beforeEach(() => {
      // disable pivot fast-path so real fetching path is used
      window.setFlag('table-updated-pivot', false);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('sets FAILURE with backend message when 403 error returned', async () => {
      const { rows, columns } = TABLE_DATA;
      const columnKey = getColumnId(columns[0]);
      const errorObj = {
        error: { status: statusCodes.forbidden, error: 'Forbidden data' },
      };
      getTableColumnDataRender.mockRejectedValueOnce(errorObj);

      const { result } = renderHook(() =>
        useTableData(10, 10, columns, rows, null, 'DEFAULT', null, 'en-US')
      );

      await act(async () => {
        result.current.fetchData();
        await Promise.resolve();
      });

      const colData = result.current.tableData[columnKey];
      expect(colData.status).toBe('FAILURE');
      expect(colData.message).toBe('Forbidden data');
    });

    it('sets FAILURE with generic message when non-403 error occurs', async () => {
      const { rows, columns } = TABLE_DATA;
      const columnKey = getColumnId(columns[0]);
      const errorObj = { error: { status: 500 } };
      getTableColumnDataRender.mockRejectedValueOnce(errorObj);

      const { result } = renderHook(() =>
        useTableData(11, 11, columns, rows, null, 'DEFAULT', null, 'en-US')
      );

      await act(async () => {
        result.current.fetchData();
        await Promise.resolve();
      });

      const colData = result.current.tableData[columnKey];
      expect(colData.status).toBe('FAILURE');
      expect(colData.message).toBe('Error loading data, please try again');
    });
  });
});
