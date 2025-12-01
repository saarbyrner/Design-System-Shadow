import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import { selectRefreshKey } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/dashboardCache';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_CHART_ELEMENTS,
  generateChartWidgetData,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import { useGetDataQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import {
  updateLoaderLevel,
  refreshWidgetCache,
  updateCachedAt,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import {
  getLoaderLevelByWidgetId,
  getWidgetRefreshCache,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { isDashboardPivoted } from '@kitman/modules/src/analysis/Dashboard/utils';
import useGetPreviewData from '../useGetPreviewData';

jest.mock('@kitman/modules/src/analysis/Dashboard/utils', () => ({
  isDashboardPivoted: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder',
  () => ({
    useGetDataQuery: jest.fn(),
  })
);

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder',
  () => ({
    getWidgetRefreshCache: jest.fn(() => jest.fn()),
    getLoaderLevelByWidgetId: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/selectors/dashboardCache',
  () => ({
    selectRefreshKey: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard',
  () => jest.fn()
);

describe('useGetPreviewData', () => {
  window.setFlag('rep-charts-v2-caching', true);
  let dispatchMock;
  const response = [
    {
      id: '1',
      metadata: {
        cached_at: '2025-06-18T14:49:51.000+01:00',
      },
      chart: [],
    },
    {
      id: '2',
      metadata: {
        cached_at: '2025-04-18T14:49:51.000+01:00',
      },
      chart: [],
    },
  ];

  const widget = generateChartWidgetData({
    widget: {
      id: '1',
      name: 'Widget Name',
      chart_id: '1',
      chart_type: 'xy',
      chart_elements: [MOCK_CHART_ELEMENTS[0]],
    },
  });
  const pivot = {
    pivotedDateRange: null,
    pivotedPopulation: null,
    pivotedTimePeriod: null,
    pivotedTimePeriodLength: null,
  };
  beforeEach(() => {
    jest.useFakeTimers();
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it('fetches the preview data', () => {
    useGetDataQuery.mockReturnValue({
      data: response,
      isLoading: false,
      error: false,
    });

    const { result } = renderHook(() =>
      useGetPreviewData(false, widget, pivot)
    );
    expect(result.current.error).toBe(false);
    expect(result.current.data).toEqual(response);

    expect(dispatchMock).toHaveBeenCalledWith(
      updateLoaderLevel({
        widgetId: widget.id,
        loaderLevel: LOADING_LEVEL.IDLE,
      })
    );
  });

  it('resets the loader to idle once the fetching is complete', () => {
    useGetDataQuery.mockReturnValue({
      data: response,
      isFetching: false,
      error: false,
    });

    const { result } = renderHook(() =>
      useGetPreviewData(false, widget, pivot)
    );
    expect(result.current.isFetching).toBe(false);

    expect(dispatchMock).toHaveBeenCalledWith(
      updateLoaderLevel({
        widgetId: widget.id,
        loaderLevel: LOADING_LEVEL.IDLE,
      })
    );
  });

  it('changes to first loader when fetching begins', async () => {
    useGetDataQuery.mockReturnValue({
      data: response,
      isFetching: true,
      error: false,
    });

    const { result } = renderHook(() =>
      useGetPreviewData(false, widget, pivot)
    );
    expect(result.current.isFetching).toBe(true);

    expect(dispatchMock).toHaveBeenCalledWith(
      updateLoaderLevel({
        widgetId: widget.id,
        loaderLevel: LOADING_LEVEL.INITIAL_LOAD,
      })
    );
  });

  it('changes to second loader after some wait if `rep-charts-v2-caching` is turned on', async () => {
    window.setFlag('rep-charts-v2-caching', true);

    useGetDataQuery.mockReturnValue({
      data: response,
      isFetching: true,
      error: false,
    });

    const { result } = renderHook(() =>
      useGetPreviewData(false, widget, pivot)
    );
    expect(result.current.isFetching).toBe(true);

    jest.advanceTimersByTime(4000);
    await waitFor(
      () => {
        expect(dispatchMock).toHaveBeenCalledWith(
          updateLoaderLevel({
            widgetId: widget.id,
            loaderLevel: LOADING_LEVEL.LONG_LOAD,
          })
        );
        expect(dispatchMock).toHaveBeenCalledTimes(2);
      },
      { timeout: 4500 }
    );
  });

  it('does not change to second loader if `rep-charts-v2-caching` is turned off', async () => {
    window.setFlag('rep-charts-v2-caching', false);
    useGetDataQuery.mockReturnValue({
      data: response,
      isFetching: true,
      error: false,
    });

    const { result } = renderHook(() =>
      useGetPreviewData(false, widget, pivot)
    );
    expect(result.current.isFetching).toBe(true);
    jest.advanceTimersByTime(4000);
    await waitFor(
      () => {
        expect(dispatchMock).not.toHaveBeenCalledWith(
          updateLoaderLevel({
            widgetId: widget.id,
            loaderLevel: LOADING_LEVEL.LONG_LOAD,
          })
        );
        expect(dispatchMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 4500 }
    );
  });

  it('extracts cachedAt from metadata and saves in state if feature flag is turned on', async () => {
    window.setFlag('rep-charts-v2-caching', true);
    useGetDataQuery.mockReturnValue({
      data: response,
      isFetching: false,
      error: false,
      fulfilledTimeStamp: Date.now(),
    });

    renderHook(() => useGetPreviewData(false, widget, pivot));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        updateCachedAt({
          widgetId: widget.id,
          cachedAt: response.map((i) => i.metadata.cached_at),
        })
      );
    });
  });

  it('does not extract cachedAt from metadata if feature flag is turned off', async () => {
    window.setFlag('rep-charts-v2-caching', false);
    useGetDataQuery.mockReturnValue({
      data: response,
      isFetching: false,
      error: false,
      fulfilledTimeStamp: Date.now(),
    });

    renderHook(() => useGetPreviewData(false, widget, pivot));

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalledWith(
        updateCachedAt({
          widgetId: widget.id,
          cachedAt: response.map((i) => i.metadata.cached_at),
        })
      );
    });
  });

  describe('refreshCache', () => {
    let refetchMock;

    beforeEach(() => {
      refetchMock = jest.fn().mockResolvedValue({});
      useGetDataQuery.mockReturnValue({
        data: response,
        isFetching: false,
        error: false,
        refetch: refetchMock,
      });

      useSelector.mockImplementation((selector) => selector());
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('calls refetch and dispatches refreshWidgetCache when refreshCache is true', async () => {
      const refreshCacheMock = jest.fn().mockReturnValue(true);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);
      const getLoaderLevelByWidgetIdMock = jest
        .fn()
        .mockReturnValue(LOADING_LEVEL.INITIAL_LOAD);
      getLoaderLevelByWidgetId.mockReturnValue(getLoaderLevelByWidgetIdMock);
      const selectRefreshKeyMock = jest.fn().mockReturnValue('1234');
      selectRefreshKey.mockReturnValue(selectRefreshKeyMock);

      renderHook(() => useGetPreviewData(false, widget, pivot));

      expect(refetchMock).toHaveBeenCalled();

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          refreshWidgetCache({
            widgetId: widget.id,
            refreshCache: false,
          })
        );
      });
    });

    it('does not call refetch or dispatch refreshWidgetCache when refreshCache is false', () => {
      const refreshCacheMock = jest.fn().mockReturnValue(false);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);

      renderHook(() => useGetPreviewData(false, widget, pivot));

      expect(refetchMock).not.toHaveBeenCalled();
      expect(dispatchMock).not.toHaveBeenCalledWith(
        refreshWidgetCache({
          widgetId: widget.id,
          refreshCache: false,
        })
      );
    });

    it('calls refetch when useShouldRefreshDashboard returns true', async () => {
      const refreshCacheMock = jest.fn().mockReturnValue(false);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);
      const getLoaderLevelByWidgetIdMock = jest
        .fn()
        .mockReturnValue(LOADING_LEVEL.IDLE);
      getLoaderLevelByWidgetId.mockReturnValue(getLoaderLevelByWidgetIdMock);

      useShouldRefreshDashboard.mockReturnValue(true);

      renderHook(() => useGetPreviewData(false, widget, pivot));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
      });
    });

    it('does not call refetch when useShouldRefreshDashboard returns false', async () => {
      const refreshCacheMock = jest.fn().mockReturnValue(false);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);

      const getLoaderLevelByWidgetIdMock = jest
        .fn()
        .mockReturnValue(LOADING_LEVEL.IDLE);
      getLoaderLevelByWidgetId.mockReturnValue(getLoaderLevelByWidgetIdMock);

      useShouldRefreshDashboard.mockReturnValue(false);

      renderHook(() => useGetPreviewData(false, widget, pivot));

      await waitFor(() => {
        expect(refetchMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('refreshCache combined with isDashboardPivoted', () => {
    let refetchMock;

    beforeEach(() => {
      useSelector.mockImplementation((selector) =>
        typeof selector === 'function' ? selector() : selector
      );
      refetchMock = jest.fn().mockResolvedValue({});
      useGetDataQuery.mockReturnValue({
        data: [],
        isFetching: false,
        error: false,
        refetch: refetchMock,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('sets refresh_cache to true when refreshCache selector true (ignores isDashboardPivoted false)', () => {
      const refreshCacheMock = jest.fn().mockReturnValue(true);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);
      getLoaderLevelByWidgetId.mockReturnValue(
        jest.fn().mockReturnValue(LOADING_LEVEL.IDLE)
      );
      isDashboardPivoted.mockReturnValue(false);

      renderHook(() => useGetPreviewData(false, widget, pivot));
      expect(useGetDataQuery).toHaveBeenCalledWith(
        expect.objectContaining({ refresh_cache: true }),
        expect.any(Object)
      );
    });

    it('sets refresh_cache to true when refreshCache false but isDashboardPivoted true', () => {
      const refreshCacheMock = jest.fn().mockReturnValue(false);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);
      getLoaderLevelByWidgetId.mockReturnValue(
        jest.fn().mockReturnValue(LOADING_LEVEL.IDLE)
      );
      isDashboardPivoted.mockReturnValue(true);

      renderHook(() => useGetPreviewData(false, widget, pivot));
      expect(useGetDataQuery).toHaveBeenCalledWith(
        expect.objectContaining({ refresh_cache: true }),
        expect.any(Object)
      );
    });

    it('sets refresh_cache to false when both refreshCache false and isDashboardPivoted false', () => {
      const refreshCacheMock = jest.fn().mockReturnValue(false);
      getWidgetRefreshCache.mockReturnValue(refreshCacheMock);
      getLoaderLevelByWidgetId.mockReturnValue(
        jest.fn().mockReturnValue(LOADING_LEVEL.IDLE)
      );
      isDashboardPivoted.mockReturnValue(false);

      renderHook(() => useGetPreviewData(false, widget, pivot));
      expect(useGetDataQuery).toHaveBeenCalledWith(
        expect.objectContaining({ refresh_cache: false }),
        expect.any(Object)
      );
    });
  });
});
