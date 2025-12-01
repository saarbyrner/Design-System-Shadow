import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import * as serviceQueryPollingModule from '@kitman/common/src/utils/serviceQueryPolling';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';
import useTableData from '../useTableData';
import useDataFetcher from '../useDataFetcher';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard',
  () => jest.fn()
);

describe('useDataFetcher', () => {
  let validateResponseWithRetrySpy;

  const rows = [{ id: 1, row_id: 'row_1' }];
  const columns = [{ id: 1, column_id: 'col_1' }];

  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it('fetches data', () => {
    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );

    const fetchColumnSpy = jest.spyOn(tableDataResult.current, 'fetchColumn');

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn
      )
    );

    expect(fetchColumnSpy).toHaveBeenCalled();
  });

  it('triggers validateResponseWithRetry when "rep-table-widget-caching" is true', async () => {
    window.setFlag('rep-table-widget-caching', true);
    validateResponseWithRetrySpy = jest
      .spyOn(serviceQueryPollingModule, 'default')
      .mockImplementation(jest.fn());
    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn
      )
    );

    await waitFor(() => {
      expect(validateResponseWithRetrySpy).toHaveBeenCalled();
    });
  });
  it('does not trigger validateResponseWithRetry when "rep-table-widget-caching" is false', async () => {
    window.setFlag('rep-table-widget-caching', false);
    validateResponseWithRetrySpy = jest
      .spyOn(serviceQueryPollingModule, 'default')
      .mockImplementation(jest.fn());
    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn
      )
    );

    await waitFor(() => {
      expect(validateResponseWithRetrySpy).not.toHaveBeenCalled();
    });
  });

  it('busts the cache on click of refresh data when "rep-table-widget-caching" is true', () => {
    window.setFlag('rep-table-widget-caching', true);
    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );

    const initiateRefreshCacheSpy = jest.spyOn(
      tableDataResult.current,
      'initiateRefreshCache'
    );

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn,
        true,
        tableDataResult.current.initiateRefreshCache
      )
    );

    expect(initiateRefreshCacheSpy).toHaveBeenCalled();
  });

  it('does not call refreshAllCacheWrapper when refreshCache stays true', () => {
    window.setFlag('rep-table-widget-caching', true);

    const mockInitiateRefreshCache = jest
      .fn()
      .mockResolvedValue({ status: 200 });
    const mockFetchColumn = jest.fn();
    const mockFetchData = jest.fn();

    const { rerender } = renderHook(
      ({ refreshCache }) => {
        return useDataFetcher(
          rows,
          columns,
          mockFetchData,
          mockFetchColumn,
          refreshCache,
          mockInitiateRefreshCache
        );
      },
      { initialProps: { refreshCache: false } }
    );

    // First transition: false > true (should call)
    rerender({ refreshCache: true });
    expect(mockInitiateRefreshCache).toHaveBeenCalledTimes(1);

    mockInitiateRefreshCache.mockClear();

    // Second render: true > true (should NOT call)
    rerender({ refreshCache: true });
    expect(mockInitiateRefreshCache).not.toHaveBeenCalled();
  });

  it('does not bust the cache when "rep-table-widget-caching" is false', () => {
    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );

    const initiateRefreshCacheSpy = jest.spyOn(
      tableDataResult.current,
      'initiateRefreshCache'
    );

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn,
        false,
        tableDataResult.current.initiateRefreshCache
      )
    );

    expect(initiateRefreshCacheSpy).not.toHaveBeenCalled();
  });

  it('re-fetches data when useShouldRefreshDashboard returns true', async () => {
    useShouldRefreshDashboard.mockReturnValue(true);

    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );
    const fetchColumnSpy = jest.spyOn(tableDataResult.current, 'fetchColumn');

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn
      )
    );
    expect(fetchColumnSpy).toHaveBeenCalled();
  });

  it('does not re-fetch data when useShouldRefreshDashboard returns false', async () => {
    useShouldRefreshDashboard.mockReturnValue(false);

    const { result: tableDataResult } = renderHook(() =>
      useTableData(1, 1, columns, rows, null, 'DEFAULT', null, 'en-US', false)
    );
    const fetchColumnSpy = jest.spyOn(tableDataResult.current, 'fetchColumn');

    renderHook(() =>
      useDataFetcher(
        rows,
        columns,
        tableDataResult.current.fetchData,
        tableDataResult.current.fetchColumn
      )
    );

    // Initial mount fetch happens once; no additional re-fetch when the hook returns false
    expect(fetchColumnSpy).toHaveBeenCalledTimes(1);
  });
});
